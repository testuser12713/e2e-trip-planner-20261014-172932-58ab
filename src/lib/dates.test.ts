import { describe, expect, it } from 'vitest'
import { deriveTripDays } from './dates'

describe('deriveTripDays', () => {
  it('returns the single day for a one-day trip', () => {
    expect(deriveTripDays('2025-05-12', '2025-05-12')).toEqual(['2025-05-12'])
  })

  it('includes both ends of a multi-day period', () => {
    expect(deriveTripDays('2025-05-12', '2025-05-14')).toEqual([
      '2025-05-12',
      '2025-05-13',
      '2025-05-14',
    ])
  })

  it('crosses a month boundary inclusively', () => {
    expect(deriveTripDays('2025-05-30', '2025-06-02')).toEqual([
      '2025-05-30',
      '2025-05-31',
      '2025-06-01',
      '2025-06-02',
    ])
  })

  it('crosses a year boundary inclusively', () => {
    expect(deriveTripDays('2025-12-31', '2026-01-01')).toEqual([
      '2025-12-31',
      '2026-01-01',
    ])
  })

  it('returns an empty list when the end lies before the start', () => {
    expect(deriveTripDays('2025-05-14', '2025-05-12')).toEqual([])
  })

  it('returns an empty list for invalid input', () => {
    expect(deriveTripDays('12.05.2025', '2025-05-14')).toEqual([])
    expect(deriveTripDays('2025-02-30', '2025-03-01')).toEqual([])
    expect(deriveTripDays('', '')).toEqual([])
  })
})
