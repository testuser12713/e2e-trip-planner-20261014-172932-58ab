import type { Activity, ActivityInput, Category } from '../types'
import { CATEGORIES } from '../types'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export const ACTIVITY_MESSAGES = {
  time: 'Bitte eine gültige Uhrzeit im Format HH:MM angeben.',
  cost: 'Die Kosten müssen eine Zahl ab 0 sein.',
  category: 'Bitte eine Kategorie wählen.',
} as const

export interface ActivityFormValues {
  time: string
  place: string
  cost: string
  category: Category | ''
}

export interface ActivityFormErrors {
  time?: string
  cost?: string
  category?: string
}

const CATEGORY_SET: ReadonlySet<string> = new Set<string>(CATEGORIES)

/** Parse the cost field; accepts a dot or a German comma as decimal separator. */
export function parseCost(raw: string): number | null {
  const normalized = raw.trim().replace(',', '.')
  if (normalized === '') return null
  const value = Number(normalized)
  if (!Number.isFinite(value) || value < 0) return null
  return value
}

/**
 * Field-bound German errors for an activity form. An empty object means the
 * values are valid. The place is free text and intentionally not required.
 */
export function validateActivity(values: ActivityFormValues): ActivityFormErrors {
  const errors: ActivityFormErrors = {}

  if (!TIME_PATTERN.test(values.time.trim())) {
    errors.time = ACTIVITY_MESSAGES.time
  }

  if (parseCost(values.cost) === null) {
    errors.cost = ACTIVITY_MESSAGES.cost
  }

  if (!CATEGORY_SET.has(values.category)) {
    errors.category = ACTIVITY_MESSAGES.category
  }

  return errors
}

export function activityToFormValues(activity: Activity): ActivityFormValues {
  return {
    time: activity.time,
    place: activity.place,
    cost: String(activity.cost),
    category: activity.category,
  }
}

/**
 * Build the stored input for an activity. `date` is the day of the trip the
 * activity belongs to; it comes from the selected day plan, not from a form
 * field, so it is passed in separately.
 */
export function formValuesToActivityInput(
  values: ActivityFormValues,
  date: string,
): ActivityInput | null {
  const errors = validateActivity(values)
  if (Object.keys(errors).length > 0) return null

  const cost = parseCost(values.cost)
  if (cost === null) return null

  return {
    time: values.time.trim(),
    place: values.place.trim(),
    cost,
    category: values.category as Category,
    date,
  }
}
