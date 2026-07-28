import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Smoke + page-level a11y on the static export, in BOTH color schemes —
// the theme-split token system means light and dark can fail independently.
test('home renders and is axe-clean in light', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Freeze your screen')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('home renders and is axe-clean in dark', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Freeze your screen')
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
