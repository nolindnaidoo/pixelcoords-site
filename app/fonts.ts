import { Geist } from 'next/font/google'
import localFont from 'next/font/local'

// Geist for body text; JetBrains Mono — vendored from the tool itself
// (crates/pixelcoords-core/assets, OFL 1.1) — for everything monospace, so
// the site's chips, commands, and JSON literally use the tool's typeface.
// The same TTF doubles as the buffer source for ImageResponse OG cards.
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// The page serves the latin-subset woff2 (37 KB vs the 270 KB full TTF —
// next/font/local does not subset or convert local files itself). The full
// TTF stays vendored: lib/og.tsx needs its raw glyph data for OG cards.
export const jetbrainsMono = localFont({
  src: './fonts/JetBrainsMono-Regular.subset.woff2',
  variable: '--font-jetbrains-mono',
})

// Applied to <html> in the root layout.
export const fontHtmlClassName = `${geistSans.variable} ${jetbrainsMono.variable} antialiased`
