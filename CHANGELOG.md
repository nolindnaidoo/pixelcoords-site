# Changelog

Written by hand. An entry explains why something mattered, which a list of
commit subjects cannot — the Conventional Commit prefixes help someone scan
`git log`, they do not replace this file.

## Unreleased

### Rebuilt in Astro

The site was a Next.js static export. It is now Astro, and the history starts
at that rebuild because no file survived it.

The reason was the content security policy. The Next tree's own `AGENTS.md`
recorded that it could not have one: the framework's inline bootstrap scripts
would have forced `unsafe-inline`, which is most of what a policy is for. Astro
ships no framework JavaScript, so the single inline script — the pre-paint
theme setter — is hashed into the served policy and there is no escape hatch in
it.

Carried over unchanged, because they are product rules rather than framework
details: the page registry that feeds the sitemap, footer, 404 list, head tags,
OG cards and every end-to-end loop from one place; the claim quarantine, where
version-specific competitor facts live in one file behind a dated stamp; and
the four-page cap on comparisons.

### Fixed

- **Four of five pages returned 404 in production.** `build.format: 'file'`
  emits `vs/pixelsnap.html`, and Vercel does not resolve an extensionless
  request to it without `cleanUrls`. `astro preview` does resolve it, so the
  entire Playwright suite passed against pages that did not exist at those URLs
  on the deployed host.
- **The sitemap and `og:url` advertised a URL no page claimed.** Three surfaces
  each built the page URL themselves and the two that rebuilt it from
  `SITE_URL + path` got the root wrong.
- **`apple-touch-icon.png` 404'd on every page.** It was referenced by a
  `<link>` and by the manifest; the port dropped the file that generated it.
- **The site rendered completely unstyled in Safari on localhost.**
  `upgrade-insecure-requests` in the meta policy is exempted on localhost by
  Chromium and applied by WebKit, so Safari rewrote every subresource to
  `https://` and failed the handshake.
- **Code samples rendered with phantom indentation.** `pre` preserves
  whitespace, and the expression sat on its own indented line inside the
  element, so the markup's indentation became part of every sample.
- **The version claim was a release behind** — caught by the drift check on its
  first run.

### Gates added

Each of these exists because something above got through. Every one was
confirmed to fail on the defect it targets before being trusted.

- `check-routes.ts` resolves every registry path the way Vercel would.
- Playwright runs Safari as well as Chromium. A Chromium-only suite passed the
  unstyled build: axe passed on an unstyled page and the visual baselines had
  been generated from the same broken build, so they matched themselves.
- `hardening.e2e.ts` asserts a computed style, not just content; that every
  declared icon resolves; and that no `<pre>` begins with whitespace.
- The generated routes are in the coverage scope. They were outside it because
  Vitest does not read tsconfig paths, so anything using the `@/*` alias was
  untestable.
- Visual comparison uses an absolute `maxDiffPixels`, not a ratio. A ratio
  scales the allowance with the element, and the desktop header's 1,561-pixel
  budget was enough to hide a whole added line of text.
