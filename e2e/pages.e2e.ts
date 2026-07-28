import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { SITE_PAGES } from '@/lib/pages'

// Every registered page: renders its h1 and is axe-clean in both schemes.
const SCHEMES = ['light', 'dark'] as const

for (const target of SITE_PAGES) {
  for (const scheme of SCHEMES) {
    test(`${target.path} renders and is axe-clean in ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(target.path)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(target.headline)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    })
  }
}
