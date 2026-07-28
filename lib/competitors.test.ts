import { describe, expect, it } from 'bun:test'
import { COMPETITORS, PIXELCOORDS_CELLS, ROW_KEYS } from './competitors'

// The quarantine contract, enforced: every competitor is stamped with a
// version and an ISO date, and every row key has a cell in every column —
// a silent gap would render as a missing claim, which reads as a hidden one.
describe('competitor quarantine data', () => {
  it('stamps every competitor with a version and ISO date', () => {
    for (const competitor of COMPETITORS) {
      expect(competitor.verifiedAgainst.version.length).toBeGreaterThan(0)
      expect(competitor.verifiedAgainst.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('fills every row for every column, ours included', () => {
    for (const key of ROW_KEYS) {
      expect(PIXELCOORDS_CELLS[key].value.length).toBeGreaterThan(0)
      for (const competitor of COMPETITORS) {
        expect(competitor.cells[key].value.length).toBeGreaterThan(0)
      }
    }
  })

  it('concedes at least one win to every competitor — generosity is policy', () => {
    for (const competitor of COMPETITORS) {
      const wins = ROW_KEYS.filter(key => competitor.cells[key].wins === true)
      expect(wins.length).toBeGreaterThan(0)
    }
  })

  it('pixelcoords does not sweep the table — the policy binds both ways', () => {
    const losses = ROW_KEYS.filter(key => PIXELCOORDS_CELLS[key].wins !== true)
    expect(losses.length).toBeGreaterThan(0)
  })
})
