<!-- BEGIN:astro-agent-rules -->
# This is Astro 7, not the Astro you know

APIs and conventions may differ from your training data. Check
`node_modules/astro/dist/types/public/config.d.ts` before changing config, and
heed deprecation notices.
<!-- END:astro-agent-rules -->

# pixelcoords-site — agent guide

Source of truth for working in this repo. If you change a convention, update
this file in the same change. `CLAUDE.md` carries the repo-specific honesty
rules; `README.md` carries the page map; **`MAINTENANCE.md` is the runbook —
every recurring ritual (stamp walk, releases, snapshots, deps, fonts) with
exact commands.** This file
adapts the house standards from `~/dev/edgeseeker/offensiveedge-web/AGENTS.md` — read
that document when a convention here is terse; the intent is identical.

## What this repo is

The promo + search site for the pixelcoords tool (`~/dev/pixelcoords`), at
**https://pixelcoords.dev**. A fully static poster: `output: 'static'`, no
API routes, no server actions, no backend seams, no fetches. Deploy is
`git push` to `main` → Vercel. The **claim quarantine** (version-specific
competitor claims live only in `src/content/competitors.ts`, rendered with a
dated "verified against" stamp; prose argues philosophy) and the **four-page
cap on `/vs/` comparisons** are product rules, not suggestions — see README.md.
Pages about pixelcoords itself are uncapped and judged on whether they
answer a question people ask.

## Stack snapshot

- **Astro 7**, `output: 'static'`, `build.format: 'file'`. `@/*` → `src/*`.
- **No component library and no UI framework.** Tailwind v4 and the token layer
  are the whole system; three vanilla `<script>` islands carry the only
  behaviour. `tailwind-variants` is gone too — a `Record` lookup covers four
  tones and three slots without a dependency.
- **`security.csp`** hashes every inline script into a `<meta>` policy. This is
  the reason the site is Astro: the Next build it replaced documented that it
  could not have a full CSP because its inline scripts would force
  `unsafe-inline`. `vercel.json` carries only what a meta policy cannot
  express — `frame-ancestors`, `upgrade-insecure-requests`, and the transport
  and cache headers.
- **TypeScript is pinned to 6.x.** `astro check` needs an API TypeScript 7's
  native compiler does not expose yet.
- **Styling:** Tailwind v4 via `@tailwindcss/vite`; tokens live in
  `src/styles/global.css` and nowhere else.
- **Theming:** an `is:inline` script in `Layout.astro` sets `.light`/`.dark` on
  `<html>` before first paint, reading `localStorage` and falling back to
  `prefers-color-scheme`. The header ThemeToggle records an explicit choice;
  system until then. Both themes must pass axe.
- **Fonts:** the body face is the **system sans stack** — Geist is not
  vendored, so the site downloads no body font at all. **JetBrains Mono is
  vendored from the tool repo** (`public/fonts/`, OFL 1.1) as a latin-subset
  woff2 and is the only font file served. The `format()` string must be
  `woff2` — `woff2-variations` is not a format any browser accepts, and a
  wrong one fails silently to a system font with nothing in the console.
- **Lint/format:** **Biome** (`biome.json`). `bun run lint` is the arbiter.
  `noUnusedImports`/`noUnusedVariables` are off for `.astro` because Biome
  lints frontmatter in isolation and cannot see template usage — `astro check`
  enforces them with full awareness, so nothing is lost.
- **Tests:** **vitest** for unit tests over `src/content`, `src/lib` and
  `scripts`; Playwright (`e2e/*.e2e.ts`, mobile project first) +
  `@axe-core/playwright` against the served `dist/`, covering per-page axe in
  both schemes, keyboard navigation, 320px reflow, the theme toggle, video
  motion (incl. reduced-motion), the 404, and SEO furniture.
- **Package manager:** bun. Never add another lockfile.

## Deliberate deviations from the house doc

- **No Sentry** — a static poster has no runtime surface worth it. The
  `reportError` seam (`src/lib/error.ts`) still exists and every catch routes
  through it, console-only.
- **No i18n** — en-only site, no locale routing.
- **No image component** — static output; plain `<img>`/`<video>` from
  `/public` with explicit dimensions.
- **No backend, no Zod** — there is nothing to parse; if a feature wants a
  fetch, it doesn't belong on this site.
- **No-JS visitors get the light theme.** Theming is class-driven and the
  class is set by script; `color-scheme` still gives them correct form
  controls and scrollbars. Accepted progressive-enhancement tradeoff —
  duplicating every token under a media query is not worth it.
- **Hex colors are allowed in exactly one place:** the `THEME_COLORS`
  constants in `src/content/site.ts`, which must mirror the `global.css`
  values as literals so the `theme-color` metas and the OG cards can read
  them. Everywhere else, tokens only.
- **Naming exceptions:** `og` (Open Graph, the protocol's name) and `coord`
  (the tool's own "coordinate chip" vocabulary) are allowed like `id`/`url`.

## Architecture

Flat features owning their UI and copy; routes are shims.

```
src/
  content/      pages.ts (THE registry) · competitors.ts (quarantine data) ·
                site.ts (canonical URLs/version/theme colours). Frozen; no logic
                beyond the lookups the pages need.
  layouts/      Layout.astro — head from the registry, theme script, skip link
  components/   shared UI + the three islands
  features/     home/ vs/ how-to/ — a feature owns its components
  pages/        routes; robots.txt.ts, sitemap.xml.ts and manifest.webmanifest.ts
                are generated so the origin has one home
  lib/          error.ts — the one reporter seam
scripts/        build-og · check-budget · check-content-drift · commit-lint
e2e/            Playwright specs (*.e2e.ts) — loops read src/content/pages.ts
```

- **Page-shaped lists are never written twice.** The registry in
  `src/content/pages.ts` feeds the sitemap, footer nav, 404 list, per-page
  head tags (`pageHead`), OG card generation, and every e2e loop. A new page is
  one registry entry plus its route + feature files — see MAINTENANCE.md.
  It costs no visual baselines: those are per-motif, not per-page.
- Routes hold only what the segment owns — the head data and the shim render.
- Features don't import features; shared things get promoted to
  `components/`/`lib/` when a second consumer appears — not before.
- No barrels. Colocation by default (`foo.ts` ↔ `foo.test.ts`).

## Browsers

The Playwright projects are mobile, desktop Chromium **and Safari**, and the
third is not optional. A Chromium-only suite passed a build that rendered
completely unstyled in Safari: `upgrade-insecure-requests` in the meta CSP is
exempted on localhost by Chromium and applied by WebKit, so Safari rewrote
every `http://localhost` subresource to `https://` and failed the handshake.
Every gate stayed green — axe passed on an unstyled page, and the visual
baselines had been generated from the same broken build, so they matched
themselves.

Two rules came out of that:

- **`upgrade-insecure-requests` lives in `vercel.json`, never in the meta
  policy.** Production is already https, so the header costs nothing there and
  the meta version breaks local preview in Safari.
- **A gate must assert a computed style, not just content.** `hardening.e2e.ts`
  checks the h1's resolved `font-size` and the container's `max-width`, because
  a page can render every word, pass axe, and match a stale baseline while
  shipping no CSS at all.

Safari is excluded from the Tab-order assertion only: it ships with links
outside the Tab order by default, which is a browser preference rather than
anything about the page.

**Develop against `bun run dev`, not `bun run preview`.** The CSP is applied at
build, so the dev server has none and behaves identically everywhere. `preview`
serves the built artifact with the production policy over plain http, which is
the one configuration where the engines disagree.

## Code principles

- **Naming:** kebab-case files for logic, PascalCase for `.astro` components;
  no abbreviations; booleans read as questions; `onX` props / `handleX`
  implementations.
- **Control flow:** early returns, no `else`/`else if` chains; ternary on
  assignment; 3+ case mappings are `as const` lookup tables.
- **Immutability:** never mutate props/state/args; prefer `readonly`,
  `as const`. Everything exported from `src/content/` is `Object.freeze`d, and
  a test asserts it.
- **Errors:** throw where it happens, catch where you can act, never
  swallow — every catch routes `reportError(error, { source })`. A floating
  promise without `.catch()` is a bug (the clipboard write included).
- **No god files** (~200-line split threshold).
- **Content truth:** every pixelcoords claim must hold for the version in
  `src/content/site.ts` per the tool repo's README / docs — reproduce the
  hedges, not just the wins. Version-specific competitor claims go in
  `src/content/competitors.ts` ONLY, stamped and dated.

## Styling & theming

- Tailwind via `class`; tokens only in `src/styles/global.css` — never hardcode
  a hex in a component; add a token instead.
- Vocabulary: `bg-background` (canvas) · `bg-surface` (panel) ·
  `text-foreground` · borders `border-border-token` · accents
  `text-preview` / `text-committed` / `text-target` (+ `-dim` washes).
  Dark mode uses the tool's exact overlay colors; light variants are
  contrast-tuned — both defined in `global.css`, flipped by class.
- **Muted text is the theme-split alpha ramp:** `text-foreground/70
  dark:text-foreground/55` (or `/65`//`/50`). Below that fails axe on small
  text.
- The three brand motifs (selection-frame, coord-chip, HUD panel) are
  components — reuse them, don't re-draw dashed borders ad hoc.
- Respect `prefers-reduced-motion` in any animation.

## Mobile-first & a11y

- Base (unprefixed) classes target the smallest screen; `sm:`/`md:` are
  progressive enhancement. **Never `max-*` walk-backs.** Verify at 360px
  first — the Playwright mobile project runs first for this reason.
- `min-h-dvh` over `min-h-screen`. Tap targets ≥44px.
- One `<main id="main-content">` per page; the skip link in `Layout.astro`
  stays the first focusable. Never remove focus rings (`focus-visible`).
- Decorative images `alt=""`; meaningful ones real alt text. Both color
  schemes must pass axe (the e2e specs check each).

## Verification — the definition of done

```bash
bun run verify
```

Chains lint → typecheck → coverage → build → payload budget → content drift →
e2e. CI (`.github/workflows/ci.yml`) runs the same steps individually so a
failure names itself in the job list, plus warn-level Lighthouse budgets
(`lighthouserc.json`), which need a Chrome the CI runner provides and a local
machine generally does not.

- **Coverage** is enforced at 100 statements/functions/lines and 97 branches
  over `src/content`, `src/lib`, **`src/pages/*.ts`** and `scripts`. `.astro`
  files are excluded because a coverage number over markup measures templating,
  not behaviour.

  The generated routes are in scope deliberately. They were outside it when the
  sitemap started advertising a URL no page claimed as canonical, and they are
  the crawler's entire view of the site — a wrong origin there is silent.
  Vitest does not read tsconfig paths, so `vitest.config.ts` declares the `@/*`
  alias itself; without it anything using the alias is simply untestable, which
  is how those routes came to have no tests.

  A test that lives in `src/pages/` needs a leading underscore. Astro routes
  every file in that directory and will otherwise try to build the test as a
  page.
- **Routes** — `scripts/check-routes.ts` resolves every registry path the way
  Vercel would and asserts a built file is behind it. It exists because the
  site shipped with four of five pages 404ing while every other gate was
  green: `build.format: 'file'` emits `vs/pixelsnap.html`, `astro preview`
  resolves an extensionless request to it and Vercel does not unless
  `cleanUrls` is on. **`build.format` and `vercel.json`'s `cleanUrls` are one
  decision in two files** — change either and this gate is what catches it.
- **Payload budget** — `scripts/check-budget.ts`. Raising it needs a written
  reason.
- **Content drift** — `scripts/check-content-drift.ts` checks `TOOL_VERSION`
  against the live crates.io release, because that number is hand-typed and
  nothing else notices when it goes stale.
- **Visual baselines** are platform-suffixed: macOS generated locally, Linux
  on the CI runner via the update-baselines workflow. The video is masked, and
  the tolerance is an absolute `maxDiffPixels`, never a ratio — a ratio scales
  the allowance with the element, so a wide motif earns a budget big enough to
  hide a whole added line of text. That is not hypothetical: at
  `maxDiffPixelRatio: 0.02` the desktop header could differ by 1,561 pixels and
  the pixelactions aside landed under it, passing a change anyone can see.

- **Declared assets** — an e2e gate fetches every `<link rel=*icon*>` and every
  icon in the manifest and asserts it resolves. `apple-touch-icon.png` was
  referenced by both and 404'd on every page for the whole life of the port: a
  missing icon is silent in the browser, in axe, and in the build.
- **Code samples** — an e2e gate asserts no `<pre>` begins with whitespace,
  because `pre` preserves the markup's own indentation and it renders as a
  first line pushed far right above continuation lines at the margin.

`bun run og` re-renders the five Open Graph cards **and the touch icon**. They
are committed, not built at deploy — a crawler must find them on first request.
The touch icon is rendered from `public/favicon.svg` rather than drawn a second
time, so the mark cannot drift from itself.

After `build`, `dist/` must contain the page HTML, `robots.txt`,
`sitemap.xml`, and the icon/OG PNGs. A change is done when it is
tested, linted, honest, and documented where behavior changed (README /
this file).

## Commits

This repo pushes straight to `main` — it deploys on push, and branches
and PRs are unwanted here. So there is no PR title to check: CI
validates the **pushed commit message** instead, which fails after the
fact rather than before. Get it right the first time.

### Conventional commits

The subject line follows
[Conventional Commits](https://www.conventionalcommits.org):

```
type(optional-scope): imperative subject
```

`type` is one of **feat · fix · docs · style · refactor · perf · test ·
build · ci · chore · revert**. A scope is optional and free-form —
`fix(locate):` and `fix:` are both fine; use one when it tells the reader
where to look.

Append `!` after the type or scope for a breaking change:
`feat(protocol)!: rename the wait verb`.

**Everything else about a commit stays as it was.** The subject is still
imperative and still says what changed rather than which files moved; the
body still carries the *why* and the user-visible consequence, at whatever
length that takes. The prefix is a label on good prose, not a replacement
for it:

```
fix(locate): refuse a region with no interior

`click_point` promises an interior point, and for anything the overlay
can draw it delivers one. A degenerate shape has none, and it returned a
fabricated point with `ok: true` regardless...
```

**CHANGELOG.md is not generated from these.** It is written by hand,
because an entry that explains why a bug mattered is worth more than a
list of subjects. The prefix helps someone scan `git log`; it does not
replace the changelog.

## Scope discipline

When the requested change is done, stop. No unrequested components, pages,
or robustness tweaks. A fifth `/vs/` comparison is a product decision, not
a PR — it commits someone to the stamp walk twice a year forever.
