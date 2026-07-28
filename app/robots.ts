import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Required under `output: "export"` — metadata routes must declare themselves
// static for the exporter to emit them as files.
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
