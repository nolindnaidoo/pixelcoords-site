import { GlobalRegistrator } from '@happy-dom/global-registrator'

// MUST be a separate preload that runs before test-setup.ts: ES imports
// hoist, so if the registrator and @testing-library imports share a module,
// testing-library's screen.js evaluates first and binds to a nonexistent
// document — every query then throws. Separate preload files are evaluated
// strictly in order.
GlobalRegistrator.register({ url: 'http://localhost/' })
