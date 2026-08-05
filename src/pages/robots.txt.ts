import type { APIRoute } from 'astro'
import { SITE_URL } from '@/content/site'

export const prerender = true

/**
 * Generated rather than committed as a static file so the origin comes from
 * the same constant the canonical tags and the sitemap use. A hand-written
 * robots.txt is one more place the domain can be wrong, and the failure is
 * silent: it advertises a sitemap that 404s and nothing complains.
 */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
    { headers: { 'content-type': 'text/plain; charset=utf-8' } },
  )
