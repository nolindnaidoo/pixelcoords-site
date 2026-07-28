import type { MetadataRoute } from 'next'
import { TAGLINE, THEME_COLORS } from '@/lib/site'

// Required under `output: "export"` — see robots.ts.
export const dynamic = 'force-static'

// Minimal honest manifest: this is a website, not an installable app, so
// display stays "browser". Icons reference the ImageResponse-emitted PNGs.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'pixelcoords',
    short_name: 'pixelcoords',
    description: TAGLINE,
    start_url: '/',
    display: 'browser',
    background_color: THEME_COLORS.light,
    theme_color: THEME_COLORS.light,
    icons: [
      { src: '/icon', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
