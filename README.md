# pixelcoords-site

[![CI](https://github.com/nolindnaidoo/pixelcoords-site/actions/workflows/ci.yml/badge.svg)](https://github.com/nolindnaidoo/pixelcoords-site/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![pixelcoords.dev](https://img.shields.io/badge/web-pixelcoords.dev-00A0FF.svg)](https://pixelcoords.dev)

**Live at [pixelcoords.dev](https://pixelcoords.dev)** — the promo and
search site for [pixelcoords](https://github.com/nolindnaidoo/pixelcoords),
the freeze-your-screen coordinate tool on
[crates.io](https://crates.io/crates/pixelcoords). Built by
[nolindnaidoo](https://github.com/nolindnaidoo).

Static Astro build on Vercel. Deploys by push to `main`.

## The family

- **[pixelcoords](https://github.com/nolindnaidoo/pixelcoords)** — the
  tool this site stages: the `pixelcoords` binary plus
  [`pixelcoords-core`](https://crates.io/crates/pixelcoords-core), the
  platform-free core (geometry, selections, session schema, template
  relocation), both on crates.io.
- **[pixelactions](https://github.com/nolindnaidoo/pixelactions)** — the
  executor half of the loop, at
  [pixelactions.dev](https://pixelactions.dev)
  ([site repo](https://github.com/nolindnaidoo/pixelactions-site)): the
  [`pixelactions`](https://crates.io/crates/pixelactions) binary plus
  [`pixelactions-core`](https://crates.io/crates/pixelactions-core),
  which reads these sessions through `pixelcoords-core`. Early, and
  macOS only.

## The page set

**Comparison pages are capped at four.** They are the only ones carrying
version-specific claims about software we don't ship, which means they are
the only ones that go stale on someone else's release schedule — that is
what the twice-yearly stamp walk costs, and four is as much of it as is
worth an hour.

**Pages about pixelcoords itself are not capped.** They go stale on our
schedule, which the per-release sweep already covers. A new one earns its
place by answering a question people actually ask; a thin page is removed,
not tolerated. That is a judgment, not a slot count.

| Page | Job |
|------|-----|
| `/` | The 10-second pitch: thesis, demo loop, MCP, install, comparison table |
| `/vs/powertoys-screen-ruler` | Windows searchers — "beyond measuring" |
| `/vs/pixelsnap` | mac searchers + the unserved "pixelsnap windows/free" gap |
| `/vs/sikulix` | Automation searchers — ground truth vs script runner |
| `/how-to/pixel-coordinates` | One how-to for the whole query family, mac/Windows/Linux sections |

The cap used to be six pages total. It was replaced because it had started
making content decisions it was not qualified to make: the MCP server landed
as a home-page section rather than its own page because a page would have
spent "the last slot", which is not a reason a reader would recognize.

## The maintenance contract

Every ritual with exact commands lives in [MAINTENANCE.md](MAINTENANCE.md).

Every version-specific claim about another tool lives in that page's
single comparison-table component, stamped "verified against X vY,
<date>". Prose argues philosophy only (what the tools *are*), so it
does not go stale. Re-verification = walk the tables, update stamps —
twice a year, calendared, about an hour. Negative claims are always
dated. Concessions are generous on purpose.

## Voice

The tool README's voice is canonical — short declaratives, no hype,
claims match reality. The site stages that content; it never forks it.
