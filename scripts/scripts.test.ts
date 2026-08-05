import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest'
import { COMPETITORS } from '../src/content/competitors'
import { TOOL_VERSION } from '../src/content/site'
import { BUDGETS, main as budgetMain, kb, walk } from './check-budget'
import { main as driftMain, publishedVersion, staleStamps } from './check-content-drift'

/**
 * The scripts are gates. Run once and seen to print a tick, they prove the
 * happy path and nothing else — a budget that never fails
 * that never detects a difference look exactly like a passing build.
 */

const scratch = mkdtempSync(join(tmpdir(), 'pixelcoords-scripts-'))
afterAll(() => rmSync(scratch, { recursive: true, force: true }))

function fakeBuild(files: Readonly<Record<string, number>>): string {
  const root = mkdtempSync(join(scratch, 'dist-'))
  for (const [relative, bytes] of Object.entries(files)) {
    const full = join(root, relative)
    mkdirSync(join(full, '..'), { recursive: true })
    writeFileSync(full, 'x'.repeat(bytes))
  }
  return root
}

describe('check-budget', () => {
  it('formats bytes as kilobytes', () => {
    expect(kb(1024)).toBe('1.0 KB')
    expect(kb(1536)).toBe('1.5 KB')
  })

  it('walks nested directories', () => {
    expect([...walk(fakeBuild({ 'a.js': 10, 'n/b.css': 10, 'n/d/c.woff2': 10 }))]).toHaveLength(3)
  })

  it('passes under the ceilings', () => {
    expect(budgetMain(fakeBuild({ 'app.js': 100, 'app.css': 100 }))).toBe(0)
  })

  it('fails over a ceiling', () => {
    const js = BUDGETS.find(budget => budget.label === 'client JS')
    expect(budgetMain(fakeBuild({ 'big.js': (js?.ceiling ?? 0) + 1 }))).toBe(1)
  })

  it('sums a class rather than checking the largest file', () => {
    // Files under the ceiling individually can blow it together — the failure
    // a per-file check would miss.
    const css = BUDGETS.find(budget => budget.label === 'CSS')
    const each = Math.ceil((css?.ceiling ?? 0) / 3)
    expect(
      budgetMain(fakeBuild({ 'a.css': each, 'b.css': each, 'c.css': each, 'd.css': each })),
    ).toBe(1)
  })

  it('reports misuse when there is no build', () => {
    expect(budgetMain(join(scratch, 'never-built'))).toBe(2)
  })
})

describe('check-content-drift', () => {
  afterEach(() => vi.unstubAllGlobals())

  function stubFetch(handler: () => Response | Promise<Response>) {
    vi.stubGlobal('fetch', vi.fn(handler))
  }

  it('reads the published version from crates.io', async () => {
    stubFetch(() => new Response(JSON.stringify({ crate: { max_stable_version: '9.9.9' } })))
    await expect(publishedVersion()).resolves.toEqual({ value: '9.9.9' })
  })

  it('reports a missing version rather than passing on undefined', async () => {
    stubFetch(() => new Response(JSON.stringify({ crate: {} })))
    expect((await publishedVersion()).error).toContain('no stable version')
  })

  it('reports a non-200 as an error', async () => {
    stubFetch(() => new Response('nope', { status: 503 }))
    expect((await publishedVersion()).error).toContain('503')
  })

  it('reports an unreachable host as an error', async () => {
    stubFetch(() => Promise.reject(new Error('offline')))
    expect((await publishedVersion()).error).toContain('unreachable')
  })

  it('fails when the site names a version crates.io does not have', async () => {
    stubFetch(() => new Response(JSON.stringify({ crate: { max_stable_version: '0.0.1' } })))
    await expect(driftMain()).resolves.toBe(1)
  })

  it('passes when the registry is unreachable', async () => {
    // An outage says nothing about whether the content is honest.
    stubFetch(() => Promise.reject(new Error('offline')))
    await expect(driftMain()).resolves.toBe(0)
  })

  it('reports stale stamps without failing the build', async () => {
    // A calendar item, not a defect — failing here would block a release that
    // changed nothing about the claim.
    stubFetch(() => new Response(JSON.stringify({ crate: { max_stable_version: TOOL_VERSION } })))
    const written: string[] = []
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation((chunk: unknown) => {
      written.push(String(chunk))
      return true
    })
    await expect(driftMain(new Date('2030-01-01'))).resolves.toBe(0)
    spy.mockRestore()
    expect(written.join('')).toContain('re-verify')
  })

  it('flags a stamp past the re-verification interval', () => {
    const distantFuture = new Date('2030-01-01')
    expect(staleStamps(distantFuture)).toHaveLength(COMPETITORS.length)
  })

  it('leaves fresh stamps alone', () => {
    const firstStamp = COMPETITORS[0]?.verifiedAgainst.date ?? '2026-07-28'
    expect(staleStamps(new Date(firstStamp))).toHaveLength(0)
  })
})
