import { describe, expect, it } from 'vitest'
import { ogImagePath, pageByPath, pageHead, SITE_PAGES } from './pages'
import { SITE_URL } from './site'

/**
 * The registry is the single source every page-shaped list renders from —
 * sitemap, footer nav, the 404 list, and the e2e loops. A malformed entry
 * therefore breaks several surfaces at once, silently, and only on the page
 * nobody opened.
 */
describe('the registry', () => {
  it('is frozen against mutation at runtime', () => {
    // `readonly` is erased at compile time; this is the half that survives.
    expect(Object.isFrozen(SITE_PAGES)).toBe(true)
  })

  it('gives every page a unique path', () => {
    const paths = SITE_PAGES.map(page => page.path)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('gives every page the fields the head needs', () => {
    for (const page of SITE_PAGES) {
      expect(page.title, `${page.path} has no title`).not.toBe('')
      expect(page.description.length, `${page.path} description is too short`).toBeGreaterThan(50)
      expect(page.headline, `${page.path} has no asserted headline`).not.toBe('')
      expect(page.navLabel, `${page.path} has no nav label`).not.toBe('')
    }
  })

  it('dates every page for the sitemap', () => {
    for (const page of SITE_PAGES) {
      expect(page.lastModified, `${page.path}`).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(page.sitemapPriority).toBeGreaterThan(0)
      expect(page.sitemapPriority).toBeLessThanOrEqual(1)
    }
  })

  it('keeps the headline a substring of the title', () => {
    // e2e asserts the rendered h1 contains `headline`; if it drifts from the
    // title the two describe different pages.
    for (const page of SITE_PAGES) {
      expect(page.title.toLowerCase(), `${page.path}`).toContain(page.headline.toLowerCase())
    }
  })
})

describe('pageByPath', () => {
  it('finds a registered page', () => {
    expect(pageByPath('/').navLabel).toBe('Home')
  })

  it('names the file to edit rather than returning undefined', () => {
    expect(() => pageByPath('/nope')).toThrow(/unknown page: \/nope/)
  })
})

describe('pageHead', () => {
  it('canonicalises the home page to the bare origin', () => {
    // A trailing slash would be a second URL for the same page.
    expect(pageHead('/').canonical).toBe(SITE_URL)
  })

  it('canonicalises other pages to origin + path', () => {
    expect(pageHead('/vs/sikulix').canonical).toBe(`${SITE_URL}/vs/sikulix`)
  })

  it('points at an absolute OG image, which consumers require', () => {
    for (const page of SITE_PAGES) {
      expect(pageHead(page.path).ogImage.startsWith('https://')).toBe(true)
    }
  })
})

describe('ogImagePath', () => {
  it('flattens a nested route into one file name', () => {
    expect(ogImagePath('/')).toBe('/og/home.png')
    expect(ogImagePath('/vs/sikulix')).toBe('/og/vs-sikulix.png')
  })

  it('gives every page a distinct card', () => {
    const cards = SITE_PAGES.map(page => ogImagePath(page.path))
    expect(new Set(cards).size).toBe(cards.length)
  })
})
