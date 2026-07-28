# Maintenance runbook

Every recurring ritual for this repo, with exact commands. If a task isn't
here, it isn't a ritual — add it when it becomes one. AGENTS.md owns the
coding standards; README.md owns the page map; this file owns *time*.

## The one gate (before any push)

```bash
bun run verify        # lint + typecheck + unit tests + build
bun run e2e           # the full Playwright suite against the export
```

CI repeats exactly this on every push (plus budget + Lighthouse), so a
skipped local run is caught — it just costs a red badge instead of seconds.

## Twice a year (calendared): the stamp walk

1. Open `lib/competitors.ts` — the ONLY file with version-specific
   competitor claims.
2. For each competitor, check its current shipping version and whether any
   cell's fact moved. Update facts if so; either way update
   `verifiedAgainst: { version, date }`.
3. `bun run verify` (the unit suite enforces stamps, full rows, and
   generosity in both directions) → push.

## Each pixelcoords release

1. `TOOL_VERSION` in `lib/site.ts`.
2. Sweep page copy against the tool's README/docs for claims the release
   changed — reproduce new hedges, retire resolved ones (e.g. the
   "pyautogui-on-Windows unverified" note when hardware verification lands).
3. Bump `lastModified` in `lib/pages.ts` for any page whose content moved.

## Intentional visual change

1. Make the change; `bun run e2e` fails on visual specs — expected.
2. `bun run snapshots` → regenerates the macOS baselines locally.
3. Push, then run the **"Update visual snapshots (Linux)"** workflow from
   the Actions tab — it regenerates the Linux baselines on the CI runner
   and commits them back. Done; next CI run is green.

## Adding the sixth page (the last slot under the cap)

1. One entry in `lib/pages.ts` (path, title, description, headline,
   navLabel, OG fields, lastModified, priority). Sitemap, footer, 404, and
   all e2e loops pick it up automatically.
2. `app/<path>/page.tsx` (shim: `pageMetadata('<path>')` + feature render)
   and `opengraph-image.tsx` (copy any existing one, change the path).
3. The feature component under `features/`.
4. Snapshots per "Intentional visual change" above.
The cap is then reached — a seventh page is a product decision, not a PR.

## Dependencies

- Dependabot opens weekly grouped PRs; CI runs on them. Merge by hand when
  green — no auto-merge here by design (no required checks; push-to-main
  is the deploy).
- **Bun itself is pinned** in `.bun-version` (CI parity). Bumping it is
  deliberate: update the file, run the full gate locally on the same
  version, push.

## Fonts

The page serves `app/fonts/JetBrainsMono-Regular.subset.woff2`. If the
vendored TTF changes or a page needs a glyph outside the subset (tofu in a
visual snapshot is the symptom): edit the ranges in and run
`scripts/subset-font.sh`, then the visual-change ritual.

## Budgets

- **JS budget** (`scripts/check-bundle-budget.ts`): raising `BUDGET_BYTES`
  requires a written reason in the commit.
- **Lighthouse** (`lighthouserc.json`): warn-level today; flip assertions
  to `error` once they've held across a few releases.

## Rarely / on drift

- `public/.well-known/security.txt` carries an `Expires` — renew yearly
  (next: 2027-07-28).
- Theme canvas colors live in TWO places by necessity: `globals.css` and
  `THEME_COLORS` in `lib/site.ts` — change both together.
- OG cards read the full TTF at `app/fonts/JetBrainsMono-Regular.ttf`;
  a missing file fails the build with a named error.
