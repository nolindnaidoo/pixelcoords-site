import { defineConfig, devices } from '@playwright/test'

/**
 * E2E + page-level a11y. Specs are `e2e/*.e2e.ts` — the suffix keeps them out
 * of `vitest`, which matches `*.test.ts`.
 *
 * The mobile project runs FIRST and is the default: base styles target the
 * smallest screen, so the gate should exercise it before desktop.
 *
 * `preview` serves the real static output, not a dev server, so the suite
 * exercises the artifact that ships — including the CSP meta tag, which a dev
 * server does not emit.
 */
const PORT = 4321
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // WebKit is not optional here. A Chromium-only suite passed a build whose
    // stylesheet Safari refused to load: `upgrade-insecure-requests` in the
    // meta CSP is exempted on localhost by Chromium and applied by WebKit, so
    // the whole site rendered unstyled in Safari and every gate stayed green.
    { name: 'safari', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `bunx astro preview --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
})
