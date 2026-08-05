// @ts-check
import tailwind from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import { SITE_URL } from './src/content/site.ts'

/**
 * A static poster: every page prerenders, nothing runs on a server.
 *
 * `security.csp` is the reason this site is Astro. The Next build could not
 * have one — its own AGENTS.md recorded why: "full CSP is deliberately absent
 * — Next's inline scripts would force unsafe-inline." Astro hashes each inline
 * script into a <meta> policy instead, so script-src carries no escape hatch.
 *
 * frame-ancestors is deliberately absent here: a meta policy cannot express
 * it, so it stays in vercel.json where a header can.
 */
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  vite: { plugins: [tailwind()] },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "media-src 'self'",
        "connect-src 'self'",
        "form-action 'none'",
        "base-uri 'self'",
        "object-src 'none'",
        // `upgrade-insecure-requests` is deliberately NOT here. Safari applies
        // it on localhost where Chromium exempts it, so the meta policy made
        // WebKit rewrite every http://localhost subresource to https:// and
        // fail the handshake — no CSS, no fonts, no video, only in Safari.
        // Production gets it from the vercel.json header, where the origin is
        // already https and the directive costs nothing.
      ],
    },
  },
})
