import type { APIRoute } from 'astro'
import { SITE_URL, TAGLINE, THEME_COLORS } from '@/content/site'

export const prerender = true

/**
 * Minimal and honest: this is a website, not an installable app, so `display`
 * stays "browser". Generated rather than committed so the tagline and the two
 * canvas colours come from the same constants the pages use.
 */
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: 'pixelcoords',
      short_name: 'pixelcoords',
      description: TAGLINE,
      start_url: '/',
      id: SITE_URL,
      display: 'browser',
      background_color: THEME_COLORS.light,
      theme_color: THEME_COLORS.light,
      icons: [
        { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
        { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    }),
    { headers: { 'content-type': 'application/manifest+json' } },
  )
