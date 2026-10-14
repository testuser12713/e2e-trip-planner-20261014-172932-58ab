export type Category =
  | 'Anreise'
  | 'Unterkunft'
  | 'Verpflegung'
  | 'Aktivität'
  | 'Shopping'
  | 'Sonstiges'

export const CATEGORIES: readonly Category[] = [
  'Anreise',
  'Unterkunft',
  'Verpflegung',
  'Aktivität',
  'Shopping',
  'Sonstiges',
]

export interface Activity {
  id: string
  time: string
  place: string
  cost: number
  category: Category
  // ISO `YYYY-MM-DD` day of the trip this activity belongs to. Required so an
  // activity always belongs to exactly one day of the trip period; the day
  // plan shows the activities whose `date` matches the selected day.
  date: string
}

export interface PackingItem {
  id: string
  text: string
  done: boolean
}

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  activities: Activity[]
  packingItems: PackingItem[]
}

export interface TripInput {
  destination: string
  startDate: string
  endDate: string
}

export interface ActivityInput {
  time: string
  place: string
  cost: number
  category: Category
  // ISO `YYYY-MM-DD` day of the trip this activity belongs to.
  date: string
}

export interface AppState {
  version: number
  trips: Trip[]
}
