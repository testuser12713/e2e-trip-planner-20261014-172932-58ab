import type { PackingItem } from '../types'

export interface PackingProgress {
  done: number
  total: number
}

export const PACKING_EMPTY_MESSAGE = 'Bitte einen Eintrag eingeben.'

export function packingProgress(items: PackingItem[]): PackingProgress {
  const total = items.length
  const done = items.filter((item) => item.done).length
  return { done, total }
}

export function validatePackingText(text: string): string | null {
  if (text.trim().length === 0) {
    return PACKING_EMPTY_MESSAGE
  }
  return null
}
