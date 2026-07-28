import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Required under `output: "export"` — see robots.ts.
export const dynamic = 'force-static'

// Grows one entry per shipped page (six-page cap — see README.md).
// lastModified is maintained by hand on content changes.
export default function sitemap(): MetadataRoute.Sitemap {
  const modified = new Date('2026-07-28')
  return [
    { url: SITE_URL, lastModified: modified, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${SITE_URL}/vs/powertoys-screen-ruler`,
      lastModified: modified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/vs/pixelsnap`,
      lastModified: modified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/vs/sikulix`,
      lastModified: modified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/how-to/pixel-coordinates`,
      lastModified: modified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]
}
