import { describe, expect, it } from 'vitest'
import { formValuesToActivityInput } from './activityValidation'

const VALID = {
  time: '09:30',
  place: 'Markt',
  cost: '12,50',
  category: 'Verpflegung' as const,
}

describe('formValuesToActivityInput — activity date', () => {
  it('carries the day passed in as the activity date', () => {
    const input = formValuesToActivityInput(VALID, '2025-05-13')

    expect(input).not.toBeNull()
    expect(input?.date).toBe('2025-05-13')
  })

  it('keeps date independent of the other fields', () => {
    const input = formValuesToActivityInput(VALID, '2025-05-14')

    expect(input?.date).toBe('2025-05-14')
    expect(input?.place).toBe('Markt')
  })

  it('still returns null for invalid values', () => {
    const input = formValuesToActivityInput(
      { ...VALID, time: '25:99' },
      '2025-05-13',
    )

    expect(input).toBeNull()
  })
})
