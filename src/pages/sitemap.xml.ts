import type { APIRoute } from 'astro'
import { SITE_PAGES } from '@/content/pages'
import { SITE_URL } from '@/content/site'

export const prerender = true

/**
 * Every entry derives from the page registry, including `lastModified` and
 * `sitemapPriority` — adding a page cannot forget the sitemap, because there
 * is no second list to update.
 */
export const GET: APIRoute = () => {
  const urls = SITE_PAGES.map(
    page => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <priority>${page.sitemapPriority}</priority>
  </url>`,
  ).join('\n')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { 'content-type': 'application/xml; charset=utf-8' } },
  )
}
