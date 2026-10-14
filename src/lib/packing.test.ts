import { describe, expect, it } from 'vitest'
import type { PackingItem } from '../types'
import {
  PACKING_EMPTY_MESSAGE,
  packingProgress,
  validatePackingText,
} from './packing'

function item(text: string, done: boolean): PackingItem {
  return { id: text, text, done }
}

describe('packingProgress', () => {
  it('counts zero of zero for an empty list', () => {
    expect(packingProgress([])).toEqual({ done: 0, total: 0 })
  })

  it('counts the done items against the total', () => {
    const items = [item('Pass', true), item('Zahnbürste', false), item('Buch', true)]
    expect(packingProgress(items)).toEqual({ done: 2, total: 3 })
  })

  it('reports total done when every item is checked', () => {
    const items = [item('Pass', true), item('Buch', true)]
    expect(packingProgress(items)).toEqual({ done: 2, total: 2 })
  })
})

describe('validatePackingText', () => {
  it('rejects an empty entry with a German message', () => {
    expect(validatePackingText('')).toBe(PACKING_EMPTY_MESSAGE)
  })

  it('rejects a whitespace-only entry', () => {
    expect(validatePackingText('   ')).toBe(PACKING_EMPTY_MESSAGE)
  })

  it('accepts a non-empty entry', () => {
    expect(validatePackingText('Zahnbürste')).toBeNull()
  })
})
