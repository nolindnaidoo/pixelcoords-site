@AGENTS.md

Repo-specific rules on top of the scaffold notes above:

- **Static export only** (`output: "export"` in next.config.ts). No API
  routes, no server actions, no runtime dependencies. This is a poster.
- **Deploy is `git push` to `main`** — Vercel auto-builds. Never run a
  vercel deploy command.
- **Content honesty is the product.** Version-specific claims about
  other tools live only in each page's comparison-table component with
  a verified-against date stamp; prose argues philosophy. Negative
  claims ("X can't do Y") are always dated. See README.md for the page
  cap and maintenance contract.
- **Voice**: match the pixelcoords README (../pixelcoords/README.md) —
  short declaratives, no hype, concessions stated plainly.
