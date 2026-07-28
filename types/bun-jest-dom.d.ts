// Extend bun:test's `expect(...)` Matchers with the @testing-library/jest-dom
// matchers we register at runtime in `test-setup.ts`. Without this, TS doesn't
// see `toBeInTheDocument`, `toHaveAttribute`, etc. on the bun matcher type —
// even though the matchers DO work at runtime via `expect.extend(matchers)`.
//
// The augmentation is namespaced to `bun:test`'s `Matchers` interface so it
// applies to every `expect(node).toBe...()` chain in the suite.

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'bun:test' {
  interface Matchers<T = unknown>
    extends TestingLibraryMatchers<typeof expect.stringContaining, T> {}
  interface AsymmetricMatchers
    extends TestingLibraryMatchers<typeof expect.stringContaining, unknown> {}
}
