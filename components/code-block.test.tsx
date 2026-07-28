import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { CodeBlock } from './code-block'

describe('CodeBlock', () => {
  it('exposes a named, focusable group — not a landmark — and is axe-clean', async () => {
    const { container } = render(
      <CodeBlock ariaLabel="Install command">cargo install pixelcoords</CodeBlock>,
    )
    const pre = container.querySelector('pre')
    expect(pre?.getAttribute('role')).toBe('group')
    expect(pre?.getAttribute('aria-label')).toBe('Install command')
    expect(pre?.getAttribute('tabindex')).toBe('0')
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })
})
