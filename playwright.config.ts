import { defineConfig, devices } from '@playwright/test'

// E2E + page-level a11y. Specs live in e2e/*.e2e.ts — the .e2e suffix keeps
// them OUT of `bun test` (which matches *.test.* and *.spec.*). The mobile
// project runs FIRST and is the default — mobile-first repo, so the gate
// exercises the small viewport before desktop. The webServer serves the real
// static export (`out/`), not a dev server, so e2e mirrors production.
const PORT = 3000
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    contextOptions: { reducedMotion: 'reduce' },
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'bun run build && bun run start',
    url: baseURL,
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
  },
})
