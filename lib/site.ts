// Canonical site + tool facts. Every page and metadata file reads from here —
// no URL or version string is written twice.
export const SITE_URL = 'https://pixelcoords.dev'
export const TOOL_VERSION = '0.1.1'
export const GITHUB_URL = 'https://github.com/nolindnaidoo/pixelcoords'
export const CRATES_URL = 'https://crates.io/crates/pixelcoords'
export const RELEASES_URL = 'https://github.com/nolindnaidoo/pixelcoords/releases'
export const DOCS_BASE_URL = 'https://github.com/nolindnaidoo/pixelcoords/blob/main/docs'

export const TAGLINE = 'Freeze your screen, mark regions, get pixel-exact coordinates and crops'

// The two canvas colors, mirrored as literals in globals.css (CSS cannot
// read TS). Consumed by the viewport themeColor metas, the ThemeToggle's
// meta sync, and the web manifest — change globals.css and this pair
// together, nowhere else.
export const THEME_COLORS = { light: '#fafafa', dark: '#0a0a0a' } as const
