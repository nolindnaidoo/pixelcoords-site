import { afterEach, describe, expect, it } from 'bun:test'
import { fireEvent, render, screen } from '@testing-library/react'
import { CopyButton } from './copy-button'

// happy-dom exposes navigator.clipboard as a readonly getter — swap it with
// defineProperty and restore after each test.
const originalDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

function setClipboard(value: { writeText: (text: string) => Promise<void> } | undefined) {
  Object.defineProperty(navigator, 'clipboard', { value, configurable: true })
}

afterEach(() => {
  if (originalDescriptor === undefined) return
  Object.defineProperty(navigator, 'clipboard', originalDescriptor)
})

describe('CopyButton', () => {
  it('shows the copied state after a successful write and announces it', async () => {
    let written = ''
    setClipboard({
      writeText: (text: string) => {
        written = text
        return Promise.resolve()
      },
    })
    render(<CopyButton text="cargo install pixelcoords" />)
    fireEvent.click(screen.getByRole('button'))
    expect(await screen.findByText('copied')).toBeInTheDocument()
    expect(written).toBe('cargo install pixelcoords')
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard')
  })

  it('does not throw when the Clipboard API is unavailable', () => {
    setClipboard(undefined)
    render(<CopyButton text="cargo install pixelcoords" />)
    expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow()
    expect(screen.getByText('copy')).toBeInTheDocument()
  })
})
