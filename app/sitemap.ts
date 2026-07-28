import type { MetadataRoute } from 'next'
import { SITE_PAGES } from '@/lib/pages'
import { SITE_URL } from '@/lib/site'

// Required under `output: "export"` — see robots.ts.
export const dynamic = 'force-static'

// Rendered entirely from the page registry (lib/pages.ts); per-page
// lastModified lives there and is bumped on content changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PAGES.map(page => ({
    url: `${SITE_URL}${page.path === '/' ? '' : page.path}`,
    lastModified: new Date(page.lastModified),
    changeFrequency: 'monthly',
    priority: page.sitemapPriority,
  }))
}
