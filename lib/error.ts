// The one reporter seam. This static site has no error backend (deliberate
// deviation from the house Sentry wiring — there is no runtime surface worth
// it); the seam still exists so every catch is attributable and a real sink
// can be swapped in behind one function if that ever changes.
export function reportError(error: unknown, context: { source: string }): void {
  console.error(`[${context.source}]`, error)
}
