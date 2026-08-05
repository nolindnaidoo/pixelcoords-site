import { describe, expect, it, vi } from 'vitest'
import { reportError } from './error'

/**
 * The one reporter seam. Ported from bun:test's `mock` to vitest's `vi.spyOn`,
 * which restores the original rather than requiring the test to put it back by
 * hand — a throw between the swap and the restore would otherwise leak a stub
 * into every test after it.
 */
describe('reportError', () => {
  it('prefixes the console line with the attributable source', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('clipboard denied')

    reportError(failure, { source: 'copy-button.write' })

    expect(spy).toHaveBeenCalledWith('[copy-button.write]', failure)
    spy.mockRestore()
  })

  it('attributes a non-Error cause just as clearly', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    reportError('a bare string', { source: 'demo-video.play' })

    expect(spy).toHaveBeenCalledWith('[demo-video.play]', 'a bare string')
    spy.mockRestore()
  })
})
