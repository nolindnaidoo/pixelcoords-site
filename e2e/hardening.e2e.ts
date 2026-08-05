import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { SITE_PAGES } from '../src/content/pages'

// The hardening gates: keyboard, reflow, theme, video motion, 404, SEO
// furniture. These run alongside the per-page axe specs.

test.describe('keyboard', () => {
  test('first Tab reveals the skip link and it moves focus to main', async ({
    page,
    browserName,
  }) => {
    // Safari ships with "Press Tab to highlight each item on a webpage" off,
    // so Tab moves between form controls only and never reaches a link. WebKit
    // mirrors that default. A Safari user who navigates by keyboard has the
    // preference on; the skip link is unchanged either way. Asserting Tab
    // order here would be testing a browser preference, not the page.
    test.skip(browserName === 'webkit', 'Safari excludes links from Tab order by default')
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to content' })
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content$/)
  })

  test('the theme toggle is keyboard-operable', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /Switch to (dark|light) theme/ }).focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveClass(/dark|light/)
  })

  test('a FAQ summary opens with Enter', async ({ page }) => {
    await page.goto('/how-to/pixel-coordinates')
    const summary = page.locator('summary').first()
    await summary.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('details').first()).toHaveAttribute('open', '')
  })

  test('focus is visibly outlined', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const outline = await page.evaluate(() => {
      const active = document.activeElement
      if (active === null) return 'none'
      return getComputedStyle(active).outlineStyle
    })
    expect(outline).not.toBe('none')
  })
})

test.describe('reflow at 320px', () => {
  for (const { path } of SITE_PAGES) {
    test(`${path} does not overflow the 320px viewport`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 800 })
      await page.goto(path)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      expect(scrollWidth).toBeLessThanOrEqual(320)
    })
  }
})

test.describe('theme toggle', () => {
  test('click sets the class, persists across reload, and syncs theme-color', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to dark theme' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute(
      'content',
      '#0a0a0a',
    )
    await page.reload()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.getByRole('button', { name: 'Switch to light theme' }).click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
})

test.describe('demo video motion', () => {
  test('plays by default and the control pauses it', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    const video = page.locator('video')
    await expect
      .poll(async () => video.evaluate(node => !(node as HTMLVideoElement).paused))
      .toBe(true)
    await page.getByRole('button', { name: /pause demo video/i }).click()
    expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
    await page.getByRole('button', { name: /play demo video/i }).click()
    await expect
      .poll(async () => video.evaluate(node => !(node as HTMLVideoElement).paused))
      .toBe(true)
  })

  test('does not autoplay under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const video = page.locator('video')
    await page.waitForTimeout(600)
    expect(await video.evaluate(node => (node as HTMLVideoElement).paused)).toBe(true)
  })
})

test.describe('not found', () => {
  test('unknown paths render the themed 404 with a single title', async ({ page }) => {
    await page.goto('/definitely-not-a-page')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Page not found')
    expect(await page.locator('title').count()).toBe(1)
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})

test.describe('seo furniture', () => {
  for (const { path } of SITE_PAGES) {
    test(`${path} carries one canonical, an og:image, and valid JSON-LD`, async ({ page }) => {
      await page.goto(path)
      expect(await page.locator('link[rel="canonical"]').count()).toBe(1)
      expect(await page.locator('meta[property="og:image"]').count()).toBeGreaterThan(0)
      const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
      for (const blob of jsonLd) {
        expect(() => JSON.parse(blob)).not.toThrow()
      }
    })
  }

  test('robots and sitemap are served and complete', async ({ request }) => {
    const robots = await request.get('/robots.txt')
    expect(robots.status()).toBe(200)
    expect(await robots.text()).toContain('Allow: /')
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    const body = await sitemap.text()
    expect(body.match(/<url>/g)?.length).toBe(SITE_PAGES.length)
  })

  test('manifest, security.txt, and llms.txt are served', async ({ request }) => {
    const manifest = await request.get('/manifest.webmanifest')
    expect(manifest.status()).toBe(200)
    expect((await manifest.json()).name).toBe('pixelcoords')
    expect((await request.get('/.well-known/security.txt')).status()).toBe(200)
    expect((await request.get('/llms.txt')).status()).toBe(200)
  })
})

test.describe('stylesheet', () => {
  test('the stylesheet loads and its rules apply', async ({ page }) => {
    const failures: string[] = []
    page.on('console', message => {
      if (message.type() === 'error') failures.push(message.text())
    })

    await page.goto('/')

    // A page can render every word, pass axe, and match a baseline generated
    // from the same broken state, all while shipping no styles at all. This
    // asserts a computed value that only exists if the stylesheet arrived.
    const clamped = await page
      .getByRole('heading', { level: 1 })
      .evaluate(node => Number.parseFloat(getComputedStyle(node).fontSize))
    expect(clamped, 'the h1 is at its unstyled default — no CSS applied').toBeGreaterThan(24)

    const container = await page
      .locator('main > div')
      .first()
      .evaluate(node => getComputedStyle(node).maxWidth)
    expect(container).not.toBe('none')

    expect(failures, 'subresources failed to load').toEqual([])
  })
})

test.describe('declared assets', () => {
  test('every icon and manifest the head points at actually resolves', async ({
    page,
    request,
  }) => {
    await page.goto('/')

    // `apple-touch-icon.png` was referenced by a link on every page and by the
    // manifest, and 404'd on all of them: the port dropped the file that
    // generated it. Nothing surfaces this — a missing icon is silent in the
    // browser, in axe, and in the build.
    const hrefs = await page
      .locator('link[rel*="icon"], link[rel="manifest"]')
      .evaluateAll(nodes => nodes.map(node => node.getAttribute('href') ?? ''))

    expect(hrefs.length, 'the head declares no icons at all').toBeGreaterThan(0)

    for (const href of hrefs) {
      const response = await request.get(href)
      expect(response.status(), `${href} is declared but does not resolve`).toBe(200)
    }
  })

  test('the manifest only lists icons that resolve', async ({ request }) => {
    const manifest = await (await request.get('/manifest.webmanifest')).json()
    for (const icon of manifest.icons as { src: string }[]) {
      const response = await request.get(icon.src)
      expect(response.status(), `${icon.src} is in the manifest but does not resolve`).toBe(200)
    }
  })
})

test.describe('code blocks', () => {
  for (const path of SITE_PAGES.map(page => page.path)) {
    test(`${path} indents its code samples only where the sample does`, async ({ page }) => {
      await page.goto(path)

      // `pre` preserves whitespace, so writing `>{expr}<` across separate lines
      // silently prefixes every sample with the source's own indentation. It
      // rendered as a first line pushed far right above continuation lines at
      // the margin, which reads as broken output rather than formatted code.
      const samples = await page.locator('pre').allTextContents()
      expect(samples.length, 'no code samples found to check').toBeGreaterThan(0)

      for (const sample of samples) {
        expect(sample, 'a code sample starts with whitespace from the markup').toBe(
          sample.replace(/^\s+/, ''),
        )
      }
    })
  }
})
