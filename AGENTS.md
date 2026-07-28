<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# pixelcoords-site — agent guide

Source of truth for working in this repo. If you change a convention, update
this file in the same change. `CLAUDE.md` carries the repo-specific honesty
rules; `README.md` carries the page map and maintenance contract. This file
adapts the house standards from `~/dev/offensiveedge-web/AGENTS.md` — read
that document when a convention here is terse; the intent is identical.

## What this repo is

The promo + search site for the pixelcoords tool (`~/dev/pixelcoords`), at
**https://pixelcoords.dev**. A fully static poster: `output: "export"`, no
API routes, no server actions, no backend seams, no fetches. Deploy is
`git push` to `main` → Vercel. **Six-page cap** (home, three `/vs/`, one
how-to, one earned spare) and the **claim quarantine** (version-specific
competitor claims live only in `lib/competitors.ts`, rendered with a dated
"verified against" stamp; prose argues philosophy) are product rules, not
suggestions — see README.md.

## Stack snapshot

- **Next.js 16** (App Router) on React 19, static export. `@/*` → repo root.
- **Components:** HeroUI v3 (`@heroui/react` + `@heroui/styles`, react-aria
  based). All usage goes through the `ui/` seam.
- **Styling:** Tailwind v4 via PostCSS; tokens in `app/globals.css` only.
  Variants with `tailwind-variants`, merging with `tailwind-merge`.
- **Theming:** next-themes (`app/providers.tsx`) toggles `.light`/`.dark` on
  `<html>`, system-driven, **no toggle UI**. Both themes must pass axe.
- **Fonts:** Geist Sans (body) + **JetBrains Mono vendored from the tool
  repo** (`app/fonts/`, OFL 1.1) — the same TTF feeds `next/font/local` and
  the ImageResponse OG cards.
- **Lint/format:** **Biome** (`biome.json`) — single quotes, no semicolons,
  2-space, 100-col, JSX attrs double-quoted. `bun run lint` is the arbiter;
  `bun run format` fixes. No ESLint.
- **Tests:** `bun test` + happy-dom + @testing-library (preloaded via
  `bunfig.toml`/`test-setup.ts`), jest-axe for component a11y; Playwright
  (`e2e/*.e2e.ts`, mobile project first) + `@axe-core/playwright` against
  the served `out/`. Suites stay minimal-but-real and grow with each page.
- **Package manager:** bun. Never add another lockfile.

## Deliberate deviations from the house doc

- **No Sentry** — a static poster has no runtime surface worth it. The
  `reportError` seam (`lib/error.ts`) still exists and every catch routes
  through it, console-only.
- **No i18n / next-intl** — en-only site, no locale routing.
- **No `next/image`** — static export; plain `<img>`/`<video>` from
  `/public` with explicit dimensions.
- **No backend, no Zod** — there is nothing to parse; if a feature wants a
  fetch, it doesn't belong on this site.

## Architecture

Flat features owning their UI, copy, and tests; routes are shims.

```
app/            routes (shims), metadata files, fonts, globals.css
features/       home/ vs/ how-to/ — a feature owns its components + tests
components/     bespoke shared UI (selection-frame, coord-chip, comparison-table, …)
ui/             thin @heroui/react re-exports, one file per primitive, created on first use
lib/            site.ts (canonical URLs/version) · competitors.ts (quarantine data) · og.tsx · error.ts
e2e/            Playwright specs (*.e2e.ts) + page a11y
```

- **Feature code imports HeroUI from `ui/`, never `@heroui/react` directly.**
  Re-exports stay thin; a wrapper may add a project default, never re-shape
  the API.
- Routes hold only what the segment owns (metadata, the shim render).
- Features don't import features; shared things get promoted to
  `components/`/`lib/` when a second consumer appears — not before.
- No barrels. Colocation by default (`foo.tsx` ↔ `foo.test.tsx`).
- Server Components by default; `"use client"` only at interactive leaves
  (HeroUI primitives are client — keep page shells server).

## Code principles

- **Naming:** kebab-case files; PascalCase components; no abbreviations;
  booleans read as questions; `onX` props / `handleX` implementations.
- **Control flow:** early returns, no `else`/`else if` chains; ternary on
  assignment; 3+ case mappings are `as const` lookup tables.
- **Immutability:** never mutate props/state/args; prefer `readonly`,
  `as const`.
- **Errors:** throw where it happens, catch where you can act, never
  swallow — every catch routes `reportError(error, { source })`. A floating
  promise without `.catch()` is a bug (the clipboard write included).
- **No class components.** No god files (~200-line split threshold).
- **Content truth:** every pixelcoords claim must hold for the version in
  `lib/site.ts` per the tool repo's README / docs — reproduce the hedges,
  not just the wins. Version-specific competitor claims go in
  `lib/competitors.ts` ONLY, stamped and dated.

## Styling & theming

- Tailwind via `className`; tokens only in `globals.css` — never hardcode a
  hex in a component; add a token instead.
- Vocabulary: `bg-background` (canvas) · `bg-surface` (panel) ·
  `text-foreground` · borders `border-border-token` · accents
  `text-preview` / `text-committed` / `text-target` (+ `-dim` washes).
  Dark mode uses the tool's exact overlay colors; light variants are
  contrast-tuned — both defined in `globals.css`, flipped by class.
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
- One `<main id="main-content">` per page; the skip link in `app/layout.tsx`
  stays the first focusable. Never remove focus rings (`focus-visible`).
- Decorative images `alt=""`; meaningful ones real alt text. Both color
  schemes must pass axe (the e2e specs check each).

## Verification — the definition of done

```bash
bun run typecheck && bun run lint && bun test && bun run build
bun run e2e        # serves out/ and runs mobile-first + axe, both schemes
```

After `build`, `out/` must contain the page HTML, `robots.txt`,
`sitemap.xml`, and the emitted icon/OG PNGs. A change is done when it is
tested, linted, honest, and documented where behavior changed (README /
this file).

## Scope discipline

When the requested change is done, stop. No unrequested components, pages,
or robustness tweaks. The six-page cap is absolute — a seventh page is a
product decision, not a PR.
