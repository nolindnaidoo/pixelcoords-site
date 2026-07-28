import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Required under `output: "export"` — see robots.ts.
export const dynamic = 'force-static'

// Grows one entry per shipped page (six-page cap — see README.md).
// lastModified is maintained by hand on content changes.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date('2026-07-28'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
