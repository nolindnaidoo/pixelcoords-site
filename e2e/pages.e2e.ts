import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Every shipped page: renders its h1 and is axe-clean in both color schemes.
const PAGES = [
  { path: '/vs/powertoys-screen-ruler', heading: 'pixelcoords vs PowerToys Screen Ruler' },
  { path: '/vs/pixelsnap', heading: 'pixelcoords vs PixelSnap 2' },
  { path: '/vs/sikulix', heading: 'pixelcoords vs SikuliX' },
  { path: '/how-to/pixel-coordinates', heading: 'How to get pixel coordinates' },
] as const

const SCHEMES = ['light', 'dark'] as const

for (const target of PAGES) {
  for (const scheme of SCHEMES) {
    test(`${target.path} renders and is axe-clean in ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto(target.path)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(target.heading)
      const results = await new AxeBuilder({ page }).analyze()
      expect(results.violations).toEqual([])
    })
  }
}
