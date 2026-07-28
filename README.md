# pixelcoords-site

The promo and search site for [pixelcoords](https://github.com/nolindnaidoo/pixelcoords)
— the freeze-your-screen coordinate tool on
[crates.io](https://crates.io/crates/pixelcoords).

Static Next.js export on Vercel. Deploys by push to `main`.

## The page set (capped at six)

| Page | Job |
|------|-----|
| `/` | The 10-second pitch: thesis, demo loop, install, comparison table |
| `/vs/powertoys-screen-ruler` | Windows searchers — "beyond measuring" |
| `/vs/pixelsnap` | mac searchers + the unserved "pixelsnap windows/free" gap |
| `/vs/sikulix` | Automation searchers — ground truth vs script runner |
| `/how-to/pixel-coordinates` | One how-to for the whole query family, mac/Windows/Linux sections |
| (spare) | Filled only if search data earns it |

## The maintenance contract

Every version-specific claim about another tool lives in that page's
single comparison-table component, stamped "verified against X vY,
<date>". Prose argues philosophy only (what the tools *are*), so it
does not go stale. Re-verification = walk the tables, update stamps —
twice a year, calendared, about an hour. Negative claims are always
dated. Concessions are generous on purpose.

## Voice

The tool README's voice is canonical — short declaratives, no hype,
claims match reality. The site stages that content; it never forks it.
