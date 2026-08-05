import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Astro resolves `@/*` from tsconfig; Vitest does not read that, so without
  // this any module using the alias is untestable — which is why the generated
  // routes had no unit tests to begin with.
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary'],
      /**
       * Behaviour only. `.astro` components are markup — a coverage number
       * over them measures templating, not logic, and produces a figure that
       * gets gamed rather than a gate that catches anything. Their assurance
       * is the Playwright suite: axe in both schemes, keyboard, reflow, and a
       * visual baseline per motif.
       */
      include: [
        'src/content/**/*.ts',
        'src/lib/**/*.ts',
        // The generated routes: robots, sitemap and the manifest. They are the
        // crawler's whole view of the site and they were outside this scope
        // when the sitemap started advertising a URL no page claimed.
        'src/pages/**/*.ts',
        'scripts/**/*.ts',
      ],
      exclude: [
        '**/*.test.ts',
        // `main` launches a browser, so the file cannot reach 100% in this
        // process. Its two pure builders — `card` and `touchIcon` — do have
        // tests in scripts.test.ts, and the images they write are asserted by
        // the payload budget and by the declared-assets e2e gate.
        'scripts/build-og.ts',
      ],
      /** A floor to ratchet upward, never lowered so a build passes. */
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 97 },
    },
  },
})
