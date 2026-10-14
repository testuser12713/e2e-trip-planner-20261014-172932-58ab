import type { TripInput } from '../types'

export interface TripFormErrors {
  destination?: string
  startDate?: string
  endDate?: string
}

export const TRIP_ERROR_MESSAGES = {
  destinationRequired: 'Bitte ein Ziel angeben.',
  startDateRequired: 'Bitte ein Startdatum angeben.',
  endDateRequired: 'Bitte ein Enddatum angeben.',
  endBeforeStart: 'Das Enddatum darf nicht vor dem Startdatum liegen.',
} as const

export function validateTripInput(input: TripInput): TripFormErrors {
  const errors: TripFormErrors = {}
  const destination = input.destination.trim()
  const startDate = input.startDate.trim()
  const endDate = input.endDate.trim()

  if (destination.length === 0) {
    errors.destination = TRIP_ERROR_MESSAGES.destinationRequired
  }
  if (startDate.length === 0) {
    errors.startDate = TRIP_ERROR_MESSAGES.startDateRequired
  }
  if (endDate.length === 0) {
    errors.endDate = TRIP_ERROR_MESSAGES.endDateRequired
  } else if (startDate.length > 0 && endDate < startDate) {
    errors.endDate = TRIP_ERROR_MESSAGES.endBeforeStart
  }

  return errors
}

export function hasTripErrors(errors: TripFormErrors): boolean {
  return Object.keys(errors).length > 0
}
