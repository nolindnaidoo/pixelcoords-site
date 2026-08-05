#!/usr/bin/env bun
/**
 * Renders one Open Graph card per registry entry into `public/og/`.
 *
 * Next generated these at build time through Satori (`ImageResponse`), which
 * meant a second layout engine with its own flexbox-only CSS subset and its
 * own font loading. Playwright is already here for the e2e suite, so the cards
 * are screenshotted from real markup in the real vendored face instead — one
 * rendering engine for the site and its social images.
 *
 * The output is committed. A crawler must find the card on first request, and
 * a build step that can fail is a bad place to discover that it did.
 *
 * Run: bun run og
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { ogImagePath, SITE_PAGES } from '../src/content/pages'
import { TOOL_VERSION } from '../src/content/site'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FONT = resolve(ROOT, 'public/fonts/JetBrainsMono-Regular.subset.woff2')

/** Open Graph's canonical size; every consumer crops from this ratio. */
const WIDTH = 1200
const HEIGHT = 630

// The tool's overlay palette, as literals — this markup never sees the
// stylesheet, so the tokens cannot reach it.
const CANVAS = '#0a0a0a'
const INK = '#ededed'
const GREEN = '#00ff66'
const BLUE = '#00a0ff'
const AMBER = '#ffb000'

export function card(fontDataUri: string, kicker: string, title: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: 'JetBrains Mono';
        src: url('${fontDataUri}') format('woff2');
      }
      * { box-sizing: border-box; margin: 0; }
      body {
        width: ${WIDTH}px;
        height: ${HEIGHT}px;
        background: ${CANVAS};
        color: ${INK};
        font-family: 'JetBrains Mono', monospace;
        padding: 76px 72px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .frame {
        position: absolute;
        inset: 40px;
        border: 1.5px dashed ${BLUE};
      }
      .handle { position: absolute; width: 9px; height: 9px; background: ${BLUE}; }
      .kicker { color: ${AMBER}; font-size: 26px; letter-spacing: 0.14em; text-transform: uppercase; }
      h1 { font-size: 42px; line-height: 1.22; letter-spacing: -0.02em; max-width: 24ch; }
      .out { color: ${GREEN}; font-size: 21px; }
      .meta { display: flex; justify-content: space-between; font-size: 21px; color: ${INK}; opacity: 0.7; }
    </style>
  </head>
  <body>
    <div class="frame">
      <span class="handle" style="top:-5px;left:-5px"></span>
      <span class="handle" style="top:-5px;right:-5px"></span>
      <span class="handle" style="bottom:-5px;left:-5px"></span>
      <span class="handle" style="bottom:-5px;right:-5px"></span>
    </div>
    <p class="kicker">${kicker}</p>
    <h1>${title}</h1>
    <p class="out">{ "label": "submit", "px": { "x": 812, "y": 440 } }</p>
    <div class="meta">
      <span>pixelcoords.dev</span>
      <span>Rust &middot; MIT &middot; v${TOOL_VERSION}</span>
    </div>
  </body>
</html>`
}

async function main(): Promise<number> {
  const fontDataUri = `data:font/woff2;base64,${readFileSync(FONT).toString('base64')}`
  const browser = await chromium.launch()

  try {
    const page = await browser.newPage({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    })

    for (const entry of SITE_PAGES) {
      await page.setContent(card(fontDataUri, entry.ogKicker, entry.ogTitle), {
        waitUntil: 'load',
      })
      await page.evaluate(() => document.fonts.ready)

      // The face is inlined, so this should always hold. Asserting it keeps a
      // silent fallback to a system font from shipping as the card everyone
      // sees when the link is shared.
      const usable = await page.evaluate(() => document.fonts.check('16px "JetBrains Mono"'))
      if (!usable) {
        process.stderr.write('\nbuild-og: the vendored face did not load; refusing to write.\n\n')
        return 1
      }

      const out = resolve(ROOT, `public${ogImagePath(entry.path)}`)
      mkdirSync(dirname(out), { recursive: true })
      await page.screenshot({ path: out, type: 'png' })
      process.stdout.write(`  ${ogImagePath(entry.path)}\n`)
    }
  } finally {
    await browser.close()
  }

  return 0
}

/* v8 ignore start -- process entry point; unreachable when imported by a test */
if (import.meta.main) {
  try {
    process.exit(await main())
  } catch (cause) {
    const detail = cause instanceof Error ? (cause.stack ?? cause.message) : String(cause)
    process.stderr.write(`\nbuild-og: failed to render the cards.\n${detail}\n\n`)
    process.exit(1)
  }
}
/* v8 ignore stop */
