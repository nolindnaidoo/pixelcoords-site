import { afterEach, expect } from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

// The DOM is already registered by test-dom.ts (see the ordering note
// there). Here: Testing Library's matchers on bun's expect, and explicit
// render cleanup between tests (bun:test doesn't auto-clean, and stacked
// renders trigger axe multiple-landmark violations).
expect.extend(matchers)
afterEach(cleanup)
