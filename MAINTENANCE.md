# Maintenance runbook

Every recurring ritual for this repo, with exact commands. If a task isn't
here, it isn't a ritual — add it when it becomes one. AGENTS.md owns the
coding standards; README.md owns the page map; this file owns *time*.

## The one gate (before any push)

```bash
bun run verify
```

Chains lint → typecheck → coverage → build → payload budget → content drift →
the full Playwright suite against `dist/`. CI repeats exactly this on every
push (plus Lighthouse, which needs a Chrome the runner has), so a skipped
local run is caught — it just costs a red badge instead of seconds.

**Develop against `bun run dev`.** `bun run preview` serves the built artifact
with the production CSP over plain http, which is the one configuration where
Safari and Chromium disagree — see the Browsers section of AGENTS.md.

## Twice a year (calendared): the stamp walk

1. Open `src/content/competitors.ts` — the ONLY file with version-specific
   competitor claims.
2. For each competitor, check its current shipping version and whether any
   cell's fact moved. Update facts if so; either way update
   `verifiedAgainst: { version, date }`.
3. `bun run verify` (the unit suite enforces stamps, full rows, and
   generosity in both directions) → push.

## Each pixelcoords release

1. `TOOL_VERSION` in `src/content/site.ts`. `bun run verify:content` checks
   this against the live crates.io release and fails when it goes stale, so
   the sweep below is the part that still needs a human.
2. Sweep page copy against the tool's README/docs for claims the release
   changed — reproduce new hedges, retire resolved ones (e.g. the
   "pyautogui-on-Windows unverified" note when hardware verification lands).
   The platform note under the platform table is the one that goes stale
   quietest: hand-verification is per platform *and* per release, so a
   release that ships overlay behavior verified on one OS must say so.
3. Bump `lastModified` in `src/content/pages.ts` for any page whose content
   moved.
4. If any page copy changed, the visual baselines did too — follow
   **Intentional visual change** below. Skipping it leaves the darwin
   baselines stale while CI stays green on Linux, so the break only
   surfaces the next time someone runs `bun run e2e` locally.

## Intentional visual change

**Editing copy is not one.** Baselines are scoped to bounded motifs — the
header, footer, install block, the two tables, the selection frame — so
adding a paragraph or rewording a section changes nothing and needs no
regeneration. If `bun run e2e` fails on a visual spec after a copy-only
edit, that is a real regression, not a stale baseline: read the diff.

This ritual applies when a motif component, a token in
`src/styles/global.css`, or a dependency that renders them actually changes:

1. Make the change; `bun run e2e` fails on visual specs — expected.
2. `bun run snapshots` → regenerates the macOS baselines locally, for all
   three browser projects.
3. Push, then run the **"Update visual snapshots (Linux)"** workflow from
   the Actions tab — it regenerates the Linux baselines on the CI runner
   and commits them back.
4. The bot's commit cannot trigger CI itself (GITHUB_TOKEN recursion
   guard), so the badge stays on the pre-baseline failure until the next
   push — or run the CI workflow manually from the Actions tab to clear
   it immediately.

## Adding a page

1. One entry in `src/content/pages.ts` (path, title, description, headline,
   navLabel, OG fields, lastModified, priority). Sitemap, footer, 404, and
   all e2e loops pick it up automatically.
2. `src/pages/<path>.astro` — a shim that passes the registry entry to
   `Layout` and renders the feature.
3. The feature component under `src/features/`.
4. `bun run og` — the card set is generated from the registry, so a new entry
   produces a new card. Commit it.

No snapshot step: page specs are per-motif, not per-page, so a new page adds
axe, reflow, and SEO coverage automatically and no baselines at all.

A **fifth `/vs/` page** is the one that needs a decision — comparison pages
are capped at four (README.md says why). Pages about pixelcoords itself are
judged on whether they answer a real question, not on a slot count.

## Dependencies

- Dependabot opens weekly grouped PRs; CI runs on them. Merge by hand when
  green — no auto-merge here by design (no required checks; push-to-main
  is the deploy).
- **Bun itself is pinned** in `.bun-version` (CI parity). Bumping it is
  deliberate: update the file, run the full gate locally on the same
  version, push.
- **TypeScript is pinned to 6.x** — `astro check` needs an API TypeScript 7's
  native compiler does not expose yet. Dependabot will offer 7; decline it
  until `@astrojs/check` supports it.

## Fonts

The site serves exactly one font file:
`public/fonts/JetBrainsMono-Regular.subset.woff2`. The body face is the system
sans stack, deliberately — there is no body font to maintain.

The full TTF is **not** vendored here; it lives in the tool repo, which is
already its home. Regenerate the subset when that TTF changes or a page needs
a glyph outside the ranges (tofu in a visual snapshot is the symptom):

```bash
brew install fonttools        # once
bash scripts/subset-font.sh   # reads ../pixelcoords/crates/pixelcoords-core/assets/
```

Then follow the visual-change ritual.

## Budgets

- **Payload budget** (`scripts/check-budget.ts`): raising the limit requires a
  written reason in the commit.
- **Lighthouse** (`lighthouserc.json`): warn-level today; flip assertions
  to `error` once they've held across a few releases. Needs a Chrome binary —
  CI has one, a dev machine often does not, which is why it is not in
  `bun run verify`.

## Rarely / on drift

- `public/.well-known/security.txt` carries an `Expires` — renew yearly
  (next: 2027-07-28).
- **CodeQL default setup must stay off.** This repo runs the advanced workflow
  (`.github/workflows/codeql.yml` + `codeql-config.yml`, which excludes tests
  and fixtures). GitHub refuses SARIF from an advanced config while default
  setup is enabled, and the job fails with a message that reads like a parse
  error. It is a repo *setting*, not a file, so nothing in the tree records it:

  ```bash
  gh api repos/nolindnaidoo/pixelcoords-site/code-scanning/default-setup --jq .state
  # not-configured  ← required
  ```
- Theme canvas colors live in TWO places by necessity:
  `src/styles/global.css` and `THEME_COLORS` in `src/content/site.ts` — change
  both together. The toggle reads the constants to update the `theme-color`
  metas, which cannot follow a media query once a manual choice is made.
- `/social.png` is the home OG card, used as the GitHub social preview on both
  repos. After changing `scripts/build-og.ts`:
  `bun run og && cp public/og/home.png public/social.png` and commit.
