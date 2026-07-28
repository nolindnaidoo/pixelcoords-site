import { expect, test } from '@playwright/test'
import { SITE_PAGES } from '@/lib/pages'

// Visual regression: full-page snapshots per page × theme. Catches the class
// of bug nothing else here can — an unintended visual change that is still
// axe-clean and still builds. The video is masked (its current frame is
// nondeterministic); baselines are platform-suffixed, generated on the Linux
// CI runner and locally on macOS (font rasterization differs per OS).
const SCHEMES = ['light', 'dark'] as const

for (const { path } of SITE_PAGES) {
  for (const scheme of SCHEMES) {
    test(`${path} looks right in ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      await expect(page).toHaveScreenshot(
        `${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-${scheme}.png`,
        {
          fullPage: true,
          mask: [page.locator('video')],
          maxDiffPixelRatio: 0.02,
        },
      )
    })
  }
}
