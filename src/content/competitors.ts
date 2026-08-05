// THE claim-quarantine artifact. Every version-specific claim about another
// tool lives HERE and nowhere else, rendered by components/comparison-table
// with a visible "verified against <name> v<version>, <date>" stamp. Prose on
// pages argues philosophy only. Re-verification (calendared, twice yearly)
// touches only this file: check each tool's shipping version, update facts if
// they moved, restamp. Concessions are stated plainly and generously —
// competitor wins render with the same positive treatment as ours.

export const ROW_KEYS = [
  'price',
  'platforms',
  'output',
  'live',
  'ocr',
  'verification',
  'relocation',
  'license',
] as const

export type RowKey = (typeof ROW_KEYS)[number]

export const ROW_LABELS: Record<RowKey, string> = {
  price: 'Price',
  platforms: 'Platforms',
  output: 'What you get out',
  live: 'Live on-screen measuring',
  ocr: 'OCR',
  verification: 'Point verification',
  relocation: 'Re-location after UI drift',
  license: 'License',
}

export type Cell = {
  readonly value: string
  readonly wins?: boolean
  readonly note?: string
}

export type Competitor = {
  readonly slug: string
  readonly name: string
  readonly url: string
  readonly verifiedAgainst: { readonly version: string; readonly date: string }
  readonly cells: Record<RowKey, Cell>
}

// Our own column — sourced from the tool's README/docs at the version in
// lib/site.ts; the same truth rule applies to us.
export const PIXELCOORDS_CELLS: Record<RowKey, Cell> = {
  price: { value: 'Free', wins: true },
  platforms: { value: 'macOS · Windows · Linux', wins: true },
  output: {
    value: 'session.json + labeled crops + cutouts + click code',
    wins: true,
    note: 'physical-pixel coordinates in three spaces, per-monitor DPI scale',
  },
  live: {
    value: '—',
    note: 'a stated non-goal: pixelcoords freezes first, by thesis',
  },
  ocr: { value: '—', note: 'a stated non-goal' },
  verification: {
    value: 'assert, diff, wait — exit codes for CI and agents',
    wins: true,
    note: 'a point, a whole trajectory from stdin, per-region pixel diffing, or blocking until the screen settles',
  },
  relocation: { value: 'find — template re-location with deltas', wins: true },
  license: { value: 'MIT, open source', wins: true },
}

export const COMPETITORS: readonly Competitor[] = [
  {
    slug: 'powertoys-screen-ruler',
    name: 'PowerToys Screen Ruler',
    url: 'https://learn.microsoft.com/en-us/windows/powertoys/screen-ruler',
    verifiedAgainst: { version: '0.100', date: '2026-07-28' },
    cells: {
      price: { value: 'Free', wins: true },
      platforms: { value: 'Windows only' },
      output: { value: 'On-screen measurement; copies a number' },
      live: { value: 'Yes — measures the live screen', wins: true },
      ocr: { value: '—' },
      verification: { value: '—' },
      relocation: { value: '—' },
      license: { value: 'MIT (PowerToys), open source', wins: true },
    },
  },
  {
    slug: 'pixelsnap',
    name: 'PixelSnap 2',
    url: 'https://pixelsnap.com',
    verifiedAgainst: { version: '2.6', date: '2026-07-28' },
    cells: {
      price: { value: '$39 one-time' },
      platforms: { value: 'macOS only' },
      output: {
        value: 'On-screen measurements; screenshots with dimensions',
        note: 'its edge-snapping while measuring is genuinely excellent',
        wins: true,
      },
      live: { value: 'Yes — live edge-snapped measuring', wins: true },
      ocr: { value: '—' },
      verification: { value: '—' },
      relocation: { value: '—' },
      license: { value: 'Proprietary' },
    },
  },
  {
    slug: 'sikulix',
    name: 'SikuliX',
    url: 'https://sikulix.github.io',
    verifiedAgainst: { version: '2.0.5 (archived March 2026)', date: '2026-07-28' },
    cells: {
      price: { value: 'Free', wins: true },
      platforms: {
        value: 'macOS · Windows · Linux (JVM)',
        wins: true,
        note: 'requires Java; development archived, continued by the OculiX fork',
      },
      output: { value: 'Automation scripts that act on the screen', wins: true },
      live: { value: 'Watches the live screen continuously', wins: true },
      ocr: { value: 'Built in (Tesseract)', wins: true },
      verification: { value: 'In-script image matching' },
      relocation: { value: 'Continuous visual search', wins: true },
      license: { value: 'MIT, open source', wins: true },
    },
  },
] as const

/** Lookup that guarantees presence — a page referencing a missing slug is a build-time bug. */
export function competitorBySlug(slug: string): Competitor {
  const found = COMPETITORS.find(entry => entry.slug === slug)
  if (found === undefined) throw new Error(`unknown competitor: ${slug}`)
  return found
}
