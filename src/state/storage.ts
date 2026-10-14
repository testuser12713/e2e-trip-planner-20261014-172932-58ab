import type {
  Activity,
  AppState,
  Category,
  PackingItem,
  Trip,
} from '../types'
import { CATEGORIES } from '../types'

export const STORAGE_KEY = 'trip-planner:v1'
export const STATE_VERSION = 1

const CATEGORY_SET: ReadonlySet<string> = new Set<string>(CATEGORIES)

export function createEmptyState(): AppState {
  return { version: STATE_VERSION, trips: [] }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function parseActivity(value: unknown): Activity | null {
  if (!isRecord(value)) return null
  const { id, time, place, cost, category } = value
  if (!isNonEmptyString(id)) return null
  if (typeof time !== 'string') return null
  if (typeof place !== 'string') return null
  if (typeof cost !== 'number' || !Number.isFinite(cost)) return null
  if (typeof category !== 'string' || !CATEGORY_SET.has(category)) return null
  return { id, time, place, cost, category: category as Category }
}

function parsePackingItem(value: unknown): PackingItem | null {
  if (!isRecord(value)) return null
  const { id, text, done } = value
  if (!isNonEmptyString(id)) return null
  if (typeof text !== 'string') return null
  if (typeof done !== 'boolean') return null
  return { id, text, done }
}

function parseTrip(value: unknown): Trip | null {
  if (!isRecord(value)) return null
  const { id, destination, startDate, endDate, activities, packingItems } = value
  if (!isNonEmptyString(id)) return null
  if (typeof destination !== 'string') return null
  if (typeof startDate !== 'string') return null
  if (typeof endDate !== 'string') return null
  if (!Array.isArray(activities) || !Array.isArray(packingItems)) return null

  const parsedActivities: Activity[] = []
  for (const entry of activities) {
    const activity = parseActivity(entry)
    if (!activity) return null
    parsedActivities.push(activity)
  }

  const parsedPackingItems: PackingItem[] = []
  for (const entry of packingItems) {
    const item = parsePackingItem(entry)
    if (!item) return null
    parsedPackingItems.push(item)
  }

  return {
    id,
    destination,
    startDate,
    endDate,
    activities: parsedActivities,
    packingItems: parsedPackingItems,
  }
}

export function parseState(value: unknown): AppState {
  if (!isRecord(value)) return createEmptyState()
  if (typeof value.version !== 'number') return createEmptyState()
  if (!Array.isArray(value.trips)) return createEmptyState()

  const trips: Trip[] = []
  for (const entry of value.trips) {
    const trip = parseTrip(entry)
    if (!trip) return createEmptyState()
    trips.push(trip)
  }

  return { version: STATE_VERSION, trips }
}

export function loadState(): AppState {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return createEmptyState()
  }

  let raw: string | null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return createEmptyState()
  }
  if (raw === null) return createEmptyState()

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return createEmptyState()
  }

  return parseState(parsed)
}

export function saveState(state: AppState): void {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable (private mode) or full; the app keeps working in memory.
  }
}
