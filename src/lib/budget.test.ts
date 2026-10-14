import { describe, expect, it } from 'vitest'
import { CATEGORIES } from '../types'
import type { Activity, Category } from '../types'
import { aggregateBudget } from './budget'

function activity(id: string, cost: number, category: Category): Activity {
  return { id, time: '10:00', place: 'Test', cost, category }
}

describe('aggregateBudget', () => {
  it('returns a zero total and empty sums for an empty list', () => {
    const result = aggregateBudget([])

    expect(result.total).toBe(0)
    for (const category of CATEGORIES) {
      expect(result.byCategory[category]).toBe(0)
    }
  })

  it('includes every category of CATEGORIES in the result', () => {
    const result = aggregateBudget([])

    expect(Object.keys(result.byCategory).sort()).toEqual([...CATEGORIES].sort())
  })

  it('sums the total across all activities', () => {
    const result = aggregateBudget([
      activity('a', 12.5, 'Verpflegung'),
      activity('b', 30, 'Anreise'),
    ])

    expect(result.total).toBeCloseTo(42.5, 2)
  })

  it('sums the costs per category', () => {
    const result = aggregateBudget([
      activity('a', 10, 'Verpflegung'),
      activity('b', 5.5, 'Verpflegung'),
      activity('c', 100, 'Unterkunft'),
    ])

    expect(result.byCategory.Verpflegung).toBeCloseTo(15.5, 2)
    expect(result.byCategory.Unterkunft).toBeCloseTo(100, 2)
    expect(result.byCategory.Anreise).toBe(0)
  })
})
