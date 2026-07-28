import { describe, expect, it, mock } from 'bun:test'
import { reportError } from './error'

describe('reportError', () => {
  it('prefixes the console line with the attributable source', () => {
    const original = console.error
    const spy = mock(() => {})
    console.error = spy
    const failure = new Error('clipboard denied')
    reportError(failure, { source: 'copy-button.write' })
    console.error = original
    expect(spy).toHaveBeenCalledWith('[copy-button.write]', failure)
  })
})
