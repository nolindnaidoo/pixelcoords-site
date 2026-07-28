import { describe, expect, it } from 'bun:test'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { COMPETITORS } from '@/lib/competitors'
import { ComparisonTable } from './comparison-table'

describe('ComparisonTable', () => {
  it('is axe-clean and every th carries a scope', async () => {
    const { container } = render(<ComparisonTable competitors={COMPETITORS} />)
    const headers = container.querySelectorAll('th')
    expect(headers.length).toBeGreaterThan(0)
    for (const header of headers) {
      expect(header.getAttribute('scope')).toMatch(/^(col|row)$/)
    }
    const results = await axe(container)
    expect(results.violations).toEqual([])
  })

  it('renders absent features with a screen-reader label, not silence', () => {
    const { container } = render(<ComparisonTable competitors={COMPETITORS} />)
    const srOnly = Array.from(container.querySelectorAll('.sr-only')).map(node => node.textContent)
    expect(srOnly).toContain('not offered')
  })

  it('hides the win glyph from assistive tech — cell text carries the meaning', () => {
    const { container } = render(<ComparisonTable competitors={COMPETITORS} />)
    for (const glyph of container.querySelectorAll('span')) {
      if (glyph.textContent?.trim() === '✓') {
        expect(glyph.getAttribute('aria-hidden')).toBe('true')
      }
    }
  })

  it('shows a dated verification stamp for every competitor', () => {
    const { container } = render(<ComparisonTable competitors={COMPETITORS} />)
    const text = container.textContent ?? ''
    for (const competitor of COMPETITORS) {
      expect(text).toContain(
        `verified against ${competitor.name} v${competitor.verifiedAgainst.version}, ${competitor.verifiedAgainst.date}`,
      )
    }
  })
})
