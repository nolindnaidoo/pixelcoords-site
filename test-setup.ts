import { afterEach, expect } from 'bun:test'
import { GlobalRegistrator } from '@happy-dom/global-registrator'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

// A real DOM for component tests, then Testing Library's matchers on bun's
// expect. a11y checks use jest-axe's `axe()` directly and assert on
// `results.violations` (its custom matcher doesn't line up with bun's types).
// happy-dom covers axe's structural rules; full-page contrast/focus checks run
// in the Playwright + @axe-core/playwright e2e suite (real browser).
//
// bun:test doesn't auto-clean Testing Library renders between tests; wire it
// explicitly so renders don't stack in document.body across tests.
// The base URL only anchors relative-href resolution during render.
GlobalRegistrator.register({ url: 'http://localhost/' })
expect.extend(matchers)
afterEach(cleanup)
