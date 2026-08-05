#!/usr/bin/env bun
/**
 * Fails the build when a route in the registry would not resolve on Vercel.
 *
 * This exists because the site shipped with four of its five pages returning
 * 404 in production while every local gate was green.
 *
 * `build.format: 'file'` emits `vs/pixelsnap.html`, not `vs/pixelsnap/index.html`.
 * `astro preview` resolves an extensionless request to that file by itself, so
 * the whole Playwright suite — axe, keyboard, reflow, visual baselines, all
 * three browsers — passed against pages that did not exist at those URLs on the
 * deployed host. Vercel only resolves them with `cleanUrls` enabled, and
 * nothing tied the two settings together.
 *
 * So this checks the deployed contract rather than the dev server's behaviour:
 * for every canonical path in the registry, work out which file Vercel would
 * actually serve given `build.format` and `vercel.json`, and assert it is
 * there. It reads both configs rather than hard-coding either, so flipping one
 * without the other fails here instead of in production.
 *
 * Run: bun run routes   (after bun run build)
 */
import { readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_PAGES } from '../src/content/pages'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BUILD = resolve(ROOT, 'dist')

export type Hosting = Readonly<{ format: 'file' | 'directory'; cleanUrls: boolean }>

/** `build.format` as declared in astro.config.mjs; Astro's own default is 'directory'. */
export function readFormat(source: string): 'file' | 'directory' {
  return /format:\s*['"]file['"]/.test(source) ? 'file' : 'directory'
}

/** `cleanUrls` as declared in vercel.json; Vercel's own default is false. */
export function readCleanUrls(source: string): boolean {
  return JSON.parse(source).cleanUrls === true
}

/**
 * The file Vercel serves for a request path, or undefined for a 404.
 *
 * Mirrors its static resolution: `cleanUrls` makes an extensionless request
 * fall back to `<path>.html`; without it only a directory index resolves.
 */
export function resolves(path: string, hosting: Hosting): string | undefined {
  if (path === '/') return 'index.html'
  const bare = path.replace(/^\//, '')
  if (hosting.format === 'directory') return `${bare}/index.html`
  return hosting.cleanUrls ? `${bare}.html` : undefined
}

function exists(build: string, file: string): boolean {
  return statSync(resolve(build, file), { throwIfNoEntry: false })?.isFile() === true
}

/** The two settings that decide resolution, read from the configs that own them. */
export function readHosting(root: string = ROOT): Hosting {
  return {
    format: readFormat(readFileSync(resolve(root, 'astro.config.mjs'), 'utf8')),
    cleanUrls: readCleanUrls(readFileSync(resolve(root, 'vercel.json'), 'utf8')),
  }
}

export function main(build: string = BUILD, hosting: Hosting = readHosting()): number {
  process.stdout.write(
    `  build.format: ${hosting.format}   vercel cleanUrls: ${hosting.cleanUrls}\n\n`,
  )

  let failed = 0

  for (const page of SITE_PAGES) {
    const file = resolves(page.path, hosting)

    if (file === undefined) {
      process.stdout.write(`  ✗ ${page.path.padEnd(30)} 404 — no file serves this path\n`)
      failed += 1
      continue
    }

    if (!exists(build, file)) {
      process.stdout.write(`  ✗ ${page.path.padEnd(30)} would serve ${file}, which is missing\n`)
      failed += 1
      continue
    }

    process.stdout.write(`  ✓ ${page.path.padEnd(30)} ${file}\n`)
  }

  if (failed === 0) {
    process.stdout.write('\nRoutes: every registry path resolves to a built file.\n')
    return 0
  }

  process.stderr.write(
    `\ncheck-routes: ${failed} route(s) would 404 in production.\n` +
      `With build.format 'file', vercel.json needs "cleanUrls": true.\n\n`,
  )
  return 1
}

/* v8 ignore start -- process entry point; unreachable when imported by a test */
if (import.meta.main) {
  try {
    process.exit(main())
  } catch (cause) {
    const detail = cause instanceof Error ? (cause.stack ?? cause.message) : String(cause)
    process.stderr.write(`\ncheck-routes: unexpected failure — this is a bug.\n${detail}\n\n`)
    process.exit(2)
  }
}
/* v8 ignore stop */
