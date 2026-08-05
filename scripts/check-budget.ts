#!/usr/bin/env bun
/**
 * Fails the build when the shipped payload grows past its ceiling.
 *
 * The whole argument for this site is that it is small — a static poster
 * arguing for a careful tool undermines itself by being slow. Nothing enforces
 * that on its own: a component that pulls in a date library costs nothing
 * visible in review and shows up only as a slower page on a phone.
 *
 * The ceilings are a floor to ratchet DOWN, never raised to make a build pass.
 * Raising one needs a written reason in the commit body.
 *
 * Run: bun run budget   (after bun run build)
 */
import { readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = resolve(ROOT, 'dist')

const KB = 1024

/**
 * Measured 2026-08-05: js 28 KB, css 24 KB, fonts 37 KB, html 142 KB across
 * six pages. Astro ships no framework runtime, which is why the JS ceiling is
 * a fraction of what the Next build needed.
 *
 * Video and posters are excluded — the demo is 2 MB of content, not payload
 * growth, and preload behaviour is what governs it.
 */
const BUDGETS = Object.freeze([
  { label: 'client JS', match: (p: string) => p.endsWith('.js'), ceiling: 50 * KB },
  { label: 'CSS', match: (p: string) => p.endsWith('.css'), ceiling: 40 * KB },
  { label: 'fonts', match: (p: string) => p.endsWith('.woff2'), ceiling: 60 * KB },
  { label: 'HTML', match: (p: string) => p.endsWith('.html'), ceiling: 200 * KB },
  { label: 'OG cards', match: (p: string) => p.includes('/og/'), ceiling: 400 * KB },
])

export function* walk(directory: string): Generator<string> {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name)
    if (entry.isDirectory()) {
      yield* walk(full)
      continue
    }
    yield full
  }
}

export function kb(bytes: number): string {
  return `${(bytes / KB).toFixed(1)} KB`
}

export { BUDGETS }

export function main(root: string = BUILD): number {
  if (!statSync(root, { throwIfNoEntry: false })?.isDirectory()) {
    process.stderr.write('\ncheck-budget: no dist/ directory — run `bun run build` first.\n\n')
    return 2
  }

  const files = [...walk(root)]
  let over = 0

  for (const budget of BUDGETS) {
    const matched = files.filter(file => budget.match(file))
    const total = matched.reduce((sum, file) => sum + statSync(file).size, 0)
    const share = Math.round((total / budget.ceiling) * 100)

    process.stdout.write(
      `  ${total > budget.ceiling ? '✗' : '✓'} ${budget.label.padEnd(10)} ${kb(total).padStart(9)} / ${kb(budget.ceiling).padStart(9)}  (${share}%, ${matched.length} file${matched.length === 1 ? '' : 's'})\n`,
    )

    if (total <= budget.ceiling) continue
    over += 1
  }

  if (over === 0) return 0

  process.stderr.write(
    `\ncheck-budget: ${over} budget(s) exceeded. Reduce the payload, or raise the ceiling in this file with the reason in your commit body.\n\n`,
  )
  return 1
}

/* v8 ignore start -- process entry point; unreachable when imported by a test */
if (import.meta.main) {
  try {
    process.exit(main())
  } catch (cause) {
    const detail = cause instanceof Error ? (cause.stack ?? cause.message) : String(cause)
    process.stderr.write(`\ncheck-budget: unexpected failure — this is a bug.\n${detail}\n\n`)
    process.exit(2)
  }
}
/* v8 ignore stop */
