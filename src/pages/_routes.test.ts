import { statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { canonicalUrl, SITE_PAGES } from '@/content/pages'
import { SITE_URL, TAGLINE, THEME_COLORS } from '@/content/site'
import { GET as manifest } from './manifest.webmanifest'
import { GET as robots } from './robots.txt'
import { GET as sitemap } from './sitemap.xml'

/**
 * Named with a leading underscore because Astro routes every file in
 * `src/pages/`, and a test file there is otherwise built as a page — it fails
 * the build trying to render itself.
 *
 * The generated routes were the one behaviour-carrying corner with no unit
 * coverage, and it is where the canonical drift shipped: the sitemap
 * advertised `pixelcoords.dev/` while the page it listed claimed
 * `pixelcoords.dev`. Nothing failed, because nothing looked.
 *
 * These are the crawler's whole view of the site. A wrong origin here is
 * silent — it advertises URLs that 404 and no visitor ever sees it.
 */

/** Astro passes a context these routes do not read; the cast keeps that honest. */
const context = {} as Parameters<typeof robots>[0]

async function bodyOf(route: typeof robots): Promise<string> {
  return await (route(context) as Response).text()
}

describe('robots.txt', () => {
  it('points at a sitemap on this origin', async () => {
    const body = await bodyOf(robots)
    expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
    expect(body).toContain('User-agent: *')
  })

  it('serves as plain text, which crawlers require', () => {
    const response = robots(context) as Response
    expect(response.headers.get('content-type')).toContain('text/plain')
  })
})

describe('sitemap.xml', () => {
  it('lists every registry page and nothing else', async () => {
    const body = await bodyOf(sitemap)
    const listed = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1])
    expect(listed).toEqual(SITE_PAGES.map(page => canonicalUrl(page.path)))
  })

  it('advertises the canonical spelling, never a second one', async () => {
    // The shipped bug: `SITE_URL + '/'` for the home page, against a canonical
    // with no trailing slash. Two URLs for one page, from one registry.
    const body = await bodyOf(sitemap)
    expect(body).toContain(`<loc>${SITE_URL}</loc>`)
    expect(body).not.toContain(`<loc>${SITE_URL}/</loc>`)
  })

  it('carries a lastmod and priority for every entry', async () => {
    const body = await bodyOf(sitemap)
    expect([...body.matchAll(/<lastmod>/g)]).toHaveLength(SITE_PAGES.length)
    expect([...body.matchAll(/<priority>/g)]).toHaveLength(SITE_PAGES.length)
  })

  it('is well-formed XML a parser will accept', async () => {
    const body = await bodyOf(sitemap)
    expect(body.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(body).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(body.trimEnd().endsWith('</urlset>')).toBe(true)
    // Every opened tag closes — a truncated sitemap is silently ignored.
    for (const tag of ['url', 'loc', 'lastmod', 'priority']) {
      const open = [...body.matchAll(new RegExp(`<${tag}>`, 'g'))].length
      const close = [...body.matchAll(new RegExp(`</${tag}>`, 'g'))].length
      expect(open, `<${tag}> is unbalanced`).toBe(close)
    }
  })

  it('serves as XML', () => {
    const response = sitemap(context) as Response
    expect(response.headers.get('content-type')).toContain('application/xml')
  })
})

describe('manifest.webmanifest', () => {
  it('reads its content from the same constants the pages do', async () => {
    const parsed = JSON.parse(await bodyOf(manifest))
    expect(parsed.description).toBe(TAGLINE)
    expect(parsed.id).toBe(SITE_URL)
    expect(parsed.background_color).toBe(THEME_COLORS.light)
    expect(parsed.theme_color).toBe(THEME_COLORS.light)
  })

  it('stays a website rather than claiming to be an installable app', async () => {
    // `standalone` would make browsers offer an install prompt for a static
    // poster with no offline story and nothing to launch.
    const parsed = JSON.parse(await bodyOf(manifest))
    expect(parsed.display).toBe('browser')
  })

  it('declares only icons the site actually ships', async () => {
    const parsed = JSON.parse(await bodyOf(manifest))
    const sources = parsed.icons.map((icon: { src: string }) => icon.src)
    expect(sources).toEqual(['/favicon.svg', '/apple-touch-icon.png'])
    for (const source of sources) {
      expect(
        statSync(resolve('public', source.replace(/^\//, '')), { throwIfNoEntry: false })?.isFile(),
        `${source} is advertised but not in public/`,
      ).toBe(true)
    }
  })

  it('serves as a manifest, which browsers require to honour it', () => {
    const response = manifest(context) as Response
    expect(response.headers.get('content-type')).toContain('application/manifest+json')
  })
})
