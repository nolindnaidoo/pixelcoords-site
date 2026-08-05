import { defineConfig } from 'vitest/config'

export default defineConfig({
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
      include: ['src/content/**/*.ts', 'src/lib/**/*.ts', 'scripts/**/*.ts'],
      exclude: ['**/*.test.ts', 'scripts/build-og.ts'],
      /** A floor to ratchet upward, never lowered so a build passes. */
      thresholds: { lines: 100, functions: 100, statements: 100, branches: 97 },
    },
  },
})
