import { SITE_URL } from './site'
// THE page registry — the single source every page-shaped list renders from:
// sitemap, footer nav, the 404's page list, and all three e2e loops (axe,
// reflow, seo). Adding the sixth page (the one remaining slot under the cap)
// is: one entry here, the page + opengraph-image files, darwin snapshots via
// `bun run snapshots`, linux via the update-snapshots workflow. Nothing else.
export type SitePage = {
  readonly path: string
  /** Document title, used absolute (the layout template is for fallbacks). */
  readonly title: string
  readonly description: string
  /** Substring the page's h1 must contain — asserted by e2e. */
  readonly headline: string
  /** Label in the footer nav and the 404 page list. */
  readonly navLabel: string
  readonly ogKicker: string
  readonly ogTitle: string
  /** Bumped by hand when the page's content changes — feeds the sitemap. */
  readonly lastModified: string
  readonly sitemapPriority: number
}

export const SITE_PAGES: readonly SitePage[] = Object.freeze([
  {
    path: '/',
    title: 'pixelcoords — Freeze your screen, mark regions, get pixel-exact coordinates and crops',
    description:
      'Freeze your screen, mark regions with five shape tools and a measure ruler, and get machine-usable output: versioned JSON coordinates, labeled crops, click code, point verification, click points in your API’s units, waiting, visual diffing, and self-healing re-location — served to your LLM over MCP. Free, MIT, macOS/Windows/Linux.',
    headline: 'Freeze your screen',
    navLabel: 'Home',
    ogKicker: 'pixelcoords',
    ogTitle: 'Freeze your screen, mark regions, get pixel-exact coordinates and crops',
    lastModified: '2026-08-04',
    sitemapPriority: 1,
  },
  {
    path: '/vs/powertoys-screen-ruler',
    title: 'pixelcoords vs PowerToys Screen Ruler',
    description:
      'Both free. Screen Ruler measures and hands you the number; pixelcoords turns regions into machine-usable coordinates, crops, click code, and verification — on macOS, Windows, and Linux.',
    headline: 'pixelcoords vs PowerToys Screen Ruler',
    navLabel: 'vs PowerToys Screen Ruler',
    ogKicker: 'comparison',
    ogTitle: 'pixelcoords vs PowerToys Screen Ruler',
    lastModified: '2026-08-02',
    sitemapPriority: 0.8,
  },
  {
    path: '/vs/pixelsnap',
    title: 'pixelcoords vs PixelSnap 2 — free, cross-platform',
    description:
      'PixelSnap is a polished $39 macOS measuring tool. pixelcoords is free, MIT, runs on macOS, Windows, and Linux, and outputs machine-usable coordinates, crops, and click code — an honest comparison.',
    headline: 'pixelcoords vs PixelSnap 2',
    navLabel: 'vs PixelSnap',
    ogKicker: 'comparison',
    ogTitle: 'pixelcoords vs PixelSnap 2',
    lastModified: '2026-08-02',
    sitemapPriority: 0.8,
  },
  {
    path: '/vs/sikulix',
    title: 'pixelcoords vs SikuliX',
    description:
      'SikuliX is a visual automation runtime that sees and acts. pixelcoords produces the ground truth your existing stack consumes: exact coordinates, assert exit codes, and drift re-location — no JVM.',
    headline: 'pixelcoords vs SikuliX',
    navLabel: 'vs SikuliX',
    ogKicker: 'comparison',
    ogTitle: 'pixelcoords vs SikuliX',
    lastModified: '2026-08-02',
    sitemapPriority: 0.8,
  },
  {
    path: '/how-to/pixel-coordinates',
    title: 'How to get pixel coordinates on macOS, Windows, and Linux',
    description:
      'The built-in way on each OS, the physical-vs-logical DPI trap that breaks scripts, and how to get coordinates a machine can use — saved, verified, and converted per display.',
    headline: 'How to get pixel coordinates',
    navLabel: 'Get pixel coordinates',
    ogKicker: 'how-to',
    ogTitle: 'Pixel coordinates on macOS, Windows, and Linux',
    lastModified: '2026-08-03',
    sitemapPriority: 0.9,
  },
])

export function pageByPath(path: string): SitePage {
  const found = SITE_PAGES.find(entry => entry.path === path)
  if (found === undefined) throw new Error(`unknown page: ${path} — add it to src/content/pages.ts`)
  return found
}

/**
 * Per-page document head, from the registry — canonical, OG and twitter card
 * in one place so a new page cannot forget any of them.
 *
 * Framework-neutral by design: Layout.astro renders these fields directly.
 * The previous version returned Next's `Metadata`, which coupled the registry
 * to the framework and would have to be rewritten on every port.
 */
export type PageHead = Readonly<{
  title: string
  description: string
  canonical: string
  ogUrl: string
  ogImage: string
  ogKicker: string
  ogTitle: string
}>

/**
 * The one absolute URL for a page — the canonical, and the only thing any
 * surface should point at.
 *
 * `/` canonicalises to the bare origin, matching what every other signal on
 * the site says. A trailing slash would be a second URL for the same page, and
 * that is exactly how this drifted: the sitemap and `og:url` each rebuilt the
 * URL from `SITE_URL + path`, so the home page was advertised as
 * `https://pixelcoords.dev/` while its own canonical said otherwise.
 */
export function canonicalUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

export function pageHead(path: string): PageHead {
  const page = pageByPath(path)
  return Object.freeze({
    title: page.title,
    description: page.description,
    canonical: canonicalUrl(page.path),
    ogUrl: canonicalUrl(page.path),
    ogImage: `${SITE_URL}${ogImagePath(page.path)}`,
    ogKicker: page.ogKicker,
    ogTitle: page.ogTitle,
  })
}

/** Where `scripts/build-og.ts` writes this page's card. */
export function ogImagePath(path: string): string {
  const slug = path === '/' ? 'home' : path.replace(/^\//, '').replace(/\//g, '-')
  return `/og/${slug}.png`
}
