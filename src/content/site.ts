// Canonical site + tool facts. Every page and metadata file reads from here —
// no URL or version string is written twice.
export const SITE_URL = 'https://pixelcoords.dev'
export const TOOL_VERSION = '0.7.7'
/** The author's own site. Kept alongside GITHUB_URL, never in place of it —
 * both are properties in the same identity network, and swapping one for the
 * other trades a backlink rather than adding one. */
export const AUTHOR_URL = 'https://nolindnaidoo.com'

export const GITHUB_URL = 'https://github.com/nolindnaidoo/pixelcoords'
export const CRATES_URL = 'https://crates.io/crates/pixelcoords'
export const RELEASES_URL = 'https://github.com/nolindnaidoo/pixelcoords/releases'
export const DOCS_BASE_URL = 'https://github.com/nolindnaidoo/pixelcoords/blob/main/docs'
// The executor half of the loop — the companion tool's site.
export const COMPANION_URL = 'https://pixelactions.dev'
// The platform-free cores.
export const CORE_URL = 'https://crates.io/crates/pixelcoords-core'
export const COMPANION_CORE_URL = 'https://crates.io/crates/pixelactions-core'
// The maker's VS Code extension family hub (letools.dev) — reciprocal link.
export const LETOOLS_URL = 'https://letools.dev'

export const TAGLINE = 'Freeze your screen, mark regions, get pixel-exact coordinates and crops'

// The two canvas colors, mirrored as literals in globals.css (CSS cannot
// read TS). Consumed by the viewport themeColor metas, the ThemeToggle's
// meta sync, and the web manifest — change globals.css and this pair
// together, nowhere else.
export const THEME_COLORS = { light: '#fafafa', dark: '#0a0a0a' } as const
