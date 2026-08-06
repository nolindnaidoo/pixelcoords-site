import { expect, test } from '@playwright/test'

// Visual regression, scoped to the brand motifs rather than whole pages.
//
// Full-page snapshots could not tell "Tailwind's grid changed under us" from
// "someone added a paragraph", so they fired on every intentional copy edit
// and never in isolation on the thing they exist to catch — 40 baselines
// regenerated for one sentence, and nine of the last thirty commits were a
// robot re-recording pixels.
//
// These are bounded elements: the token layer, the three brand motifs, and
// the chrome. Copy edits do not move them. A dependency bump that breaks the
// dashed frame, the chip, the token palette, or the table rules does, loudly.
// Baselines stay platform-suffixed (font rasterization differs per OS),
// generated on the Linux CI runner and locally on macOS.
const SCHEMES = ['light', 'dark'] as const

// A bounded element has to be snapshotted somewhere real, so each motif names
// where it lives — testing it in place is the point, not a gallery route.
const MOTIFS = [
  { name: 'header', path: '/', selector: 'header' },
  { name: 'footer', path: '/', selector: 'footer' },
  // CoordChip + CodeBlock + CopyButton together — the densest token surface.
  { name: 'install-block', path: '/', selector: '#install' },
  // The quarantine's rendering: rules, stamps, the ✓ / — treatment.
  { name: 'comparison-table', path: '/', selector: '[aria-label="Feature comparison"]' },
  // The MCP tool table — a plain bordered table on the same tokens.
  { name: 'mcp-tools', path: '/', selector: '[aria-label="MCP tools"]' },
  // SelectionFrame: dashed border, four corner handles, riding label chip.
  // Its child is the demo video, whose current frame is nondeterministic.
  { name: 'selection-frame', path: '/', selector: 'main .border-dashed' },
] as const

for (const motif of MOTIFS) {
  for (const scheme of SCHEMES) {
    test(`${motif.name} renders in ${scheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' })
      await page.goto(motif.path)
      await page.waitForLoadState('networkidle')
      await expect(page.locator(motif.selector).first()).toHaveScreenshot(
        `${motif.name}-${scheme}.png`,
        {
          mask: [page.locator('video')],
          // An absolute budget, not a ratio. A ratio scales the tolerance with
          // the element, so a wide mostly-empty motif earns a huge allowance:
          // at 0.02 the 1280x61 header could differ by 1,561 pixels, and a
          // whole line of added text came in under that. The desktop baseline
          // passed a change anyone can see, and only the smaller mobile
          // viewport caught it.
          //
          // Baselines are platform-suffixed and generated on the platform that
          // compares them, so the only legitimate difference is antialiasing
          // jitter — worth a small fixed budget, never a proportional one.
          maxDiffPixels: 120,
        },
      )
    })
  }
}
