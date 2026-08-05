import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as site from './site'
import { SITE_URL, THEME_COLORS, TOOL_VERSION } from './site'

/**
 * These constants are the ones written twice by necessity, and a comment
 * saying "change both together" is a hope, not a mechanism. The failures are
 * all silent: a themed browser chrome that no longer matches the canvas, a URL
 * with a stray slash that becomes a second address for one page.
 */

const CSS = readFileSync('src/styles/global.css', 'utf8')

/** The `--background` declared under a theme selector in global.css. */
function canvasColour(selector: string): string {
  const block = CSS.split(selector)[1] ?? ''
  return (block.match(/--background:\s*(#[0-9a-f]{3,8})/i)?.[1] ?? '').toLowerCase()
}

describe('THEME_COLORS', () => {
  it('matches the canvas global.css actually paints', () => {
    // CSS cannot read TypeScript, so the pair is duplicated on purpose. This
    // is the check that makes the duplication safe: the theme-color metas and
    // the manifest all read these, and a drifted value shows as browser chrome
    // in one colour above a page in another.
    expect(THEME_COLORS.light, 'light canvas drifted from global.css').toBe(
      canvasColour(':root,\n.light {'),
    )
    expect(THEME_COLORS.dark, 'dark canvas drifted from global.css').toBe(canvasColour('.dark {'))
  })

  it('gives the two themes different canvases', () => {
    expect(THEME_COLORS.light).not.toBe(THEME_COLORS.dark)
  })
})

describe('the URL constants', () => {
  const urls = Object.entries(site).filter(([name]) => name.endsWith('_URL'))

  it('exports the ones every surface reads', () => {
    expect(urls.length).toBeGreaterThan(5)
  })

  it.each(urls)('%s is absolute https with no trailing slash', (name, value) => {
    expect(typeof value, `${name} is not a string`).toBe('string')
    const url = String(value)
    expect(url.startsWith('https://'), `${name} is not https`).toBe(true)
    // A trailing slash here becomes a second spelling of every URL built from
    // it — the exact defect that put `pixelcoords.dev/` in the sitemap.
    expect(url.endsWith('/'), `${name} has a trailing slash`).toBe(false)
    expect(() => new URL(url), `${name} is not a parseable URL`).not.toThrow()
  })

  it('keeps the author link and the repo link as separate facts', () => {
    // They answer different questions and one has been swapped for the other
    // before. Both are backlinks; trading them loses one.
    expect(site.AUTHOR_URL).not.toBe(site.GITHUB_URL)
    expect(new URL(site.AUTHOR_URL).hostname).not.toBe(new URL(site.GITHUB_URL).hostname)
  })
})

describe('TOOL_VERSION', () => {
  it('is a bare semver, which is what crates.io compares against', () => {
    // `check-content-drift.ts` string-compares this with the published
    // release; a `v` prefix or a range would never match and the gate would
    // fail on every run until someone disabled it.
    expect(TOOL_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})

describe('SITE_URL', () => {
  it('is the origin the canonical tags are built from', () => {
    expect(SITE_URL).toBe(new URL(SITE_URL).origin)
  })
})
