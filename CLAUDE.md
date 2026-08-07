@AGENTS.md

Repo-specific rules on top of the scaffold notes above:

- **Static output only** (`output: 'static'` in `astro.config.mjs`). No API
  routes, no server endpoints, no runtime dependencies. This is a poster.
- **Content honesty is the product.** Version-specific claims about
  other tools live only in `src/content/competitors.ts`, rendered with a
  verified-against date stamp; prose argues philosophy. Negative
  claims ("X can't do Y") are always dated. See README.md for the `/vs/`
  cap and maintenance contract.
- **Voice**: match the pixelcoords README (../pixelcoords/README.md) —
  short declaratives, no hype, concessions stated plainly.
