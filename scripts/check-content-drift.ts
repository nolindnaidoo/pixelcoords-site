#!/usr/bin/env bun
/**
 * Checks the site's version claims against the registries that own them.
 *
 * `TOOL_VERSION` in `content/site.ts` gates every claim on this site — the
 * repo's own rule is that a statement must hold for that version. It was
 * hand-bumped with nothing checking it, so the site could confidently describe
 * a release that shipped months ago.
 *
 * A network failure is not drift. An unreachable registry warns and passes,
 * because an outage says nothing about whether the content is honest. A
 * reachable registry that disagrees fails the build.
 *
 * Run: bun run verify:content
 */
import { COMPETITORS } from '../src/content/competitors'
import { TOOL_VERSION } from '../src/content/site'

const TIMEOUT_MS = 20_000

/** Competitor claims are re-verified by hand twice yearly; warn past this. */
const STAMP_MAX_AGE_DAYS = 200

type Fetched<T> = { value: T; error?: undefined } | { value?: undefined; error: string }

async function fetchJson<T>(url: string): Promise<Fetched<T>> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': 'pixelcoords-site content check' },
    })
    if (!response.ok) return { error: `${url} responded ${response.status}` }
    return { value: (await response.json()) as T }
  } catch (cause) {
    return { error: `${url} unreachable: ${cause instanceof Error ? cause.message : cause}` }
  }
}

export async function publishedVersion(): Promise<Fetched<string>> {
  const result = await fetchJson<{ crate?: { max_stable_version?: string } }>(
    'https://crates.io/api/v1/crates/pixelcoords',
  )
  // Narrowing on `.error` does not exclude `undefined` from `.value` here, so
  // the value is checked directly rather than inferred from the error branch.
  if (result.value === undefined) return { error: result.error }
  const version = result.value.crate?.max_stable_version
  if (version === undefined) return { error: 'crates.io returned no stable version' }
  return { value: version }
}

/** Stamps older than the re-verification interval, in days. */
export function staleStamps(today: Date): readonly { name: string; age: number }[] {
  return COMPETITORS.map(competitor => ({
    name: competitor.name,
    age: Math.floor(
      (today.getTime() - new Date(competitor.verifiedAgainst.date).getTime()) / 86_400_000,
    ),
  })).filter(entry => entry.age > STAMP_MAX_AGE_DAYS)
}

export async function main(today: Date = new Date()): Promise<number> {
  const published = await publishedVersion()
  let failed = 0

  if (published.error) {
    process.stdout.write(`  ~ skipped: crates.io — ${published.error}\n`)
  }

  if (published.value !== undefined) {
    const matches = published.value === TOOL_VERSION
    process.stdout.write(
      `  ${matches ? '✓' : '✗'} tool version         site says ${TOOL_VERSION}, crates.io says ${published.value}\n`,
    )
    if (!matches) failed += 1
  }

  // A warning, not a failure: an out-of-date stamp is a calendar item, and
  // failing the build over one would block a release that changed nothing
  // about the claim.
  for (const stamp of staleStamps(today)) {
    process.stdout.write(`  ~ ${stamp.name} verified ${stamp.age} days ago — re-verify\n`)
  }

  if (failed === 0) return 0

  process.stderr.write(
    '\ncheck-content-drift: the site describes a version that is not the published one.\n' +
      'Bump TOOL_VERSION and re-check every claim against the tool docs.\n\n',
  )
  return 1
}

/* v8 ignore start -- process entry point; unreachable when imported by a test */
if (import.meta.main) {
  try {
    process.exit(await main())
  } catch (cause) {
    const detail = cause instanceof Error ? (cause.stack ?? cause.message) : String(cause)
    process.stderr.write(
      `\ncheck-content-drift: unexpected failure — this is a bug.\n${detail}\n\n`,
    )
    process.exit(2)
  }
}
/* v8 ignore stop */
