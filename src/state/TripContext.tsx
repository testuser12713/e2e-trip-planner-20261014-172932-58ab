import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ActivityInput, AppState, Trip, TripInput } from '../types'
import { loadState, saveState } from './storage'

export interface TripStore {
  trips: Trip[]
  getTrip(id: string): Trip | undefined
  addTrip(input: TripInput): Trip
  updateTrip(id: string, input: TripInput): void
  deleteTrip(id: string): void
  addActivity(tripId: string, input: ActivityInput): void
  updateActivity(tripId: string, activityId: string, input: ActivityInput): void
  deleteActivity(tripId: string, activityId: string): void
  addPackingItem(tripId: string, text: string): void
  togglePackingItem(tripId: string, itemId: string): void
  deletePackingItem(tripId: string, itemId: string): void
}

const TripContext = createContext<TripStore | null>(null)

function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function sortTrips(trips: Trip[]): Trip[] {
  return [...trips].sort((a, b) => {
    if (a.startDate !== b.startDate) return a.startDate < b.startDate ? -1 : 1
    if (a.endDate !== b.endDate) return a.endDate < b.endDate ? -1 : 1
    return a.destination.localeCompare(b.destination)
  })
}

function sortActivities(trip: Trip): Trip {
  return {
    ...trip,
    activities: [...trip.activities].sort((a, b) => {
      if (a.time !== b.time) return a.time < b.time ? -1 : 1
      return a.place.localeCompare(b.place)
    }),
  }
}

function updateTripById(
  trips: Trip[],
  tripId: string,
  update: (trip: Trip) => Trip,
): Trip[] {
  return sortTrips(trips.map((trip) => (trip.id === tripId ? update(trip) : trip)))
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const commit = useCallback((update: (current: AppState) => AppState) => {
    setState((current) => update(current))
  }, [])

  const getTrip = useCallback(
    (id: string): Trip | undefined => state.trips.find((trip) => trip.id === id),
    [state.trips],
  )

  const addTrip = useCallback(
    (input: TripInput): Trip => {
      const trip: Trip = {
        id: newId(),
        destination: input.destination,
        startDate: input.startDate,
        endDate: input.endDate,
        activities: [],
        packingItems: [],
      }
      commit((current) => ({
        ...current,
        trips: sortTrips([...current.trips, trip]),
      }))
      return trip
    },
    [commit],
  )

  const updateTrip = useCallback(
    (id: string, input: TripInput): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, id, (trip) => ({
          ...trip,
          destination: input.destination,
          startDate: input.startDate,
          endDate: input.endDate,
        })),
      }))
    },
    [commit],
  )

  const deleteTrip = useCallback(
    (id: string): void => {
      commit((current) => ({
        ...current,
        trips: current.trips.filter((trip) => trip.id !== id),
      }))
    },
    [commit],
  )

  const addActivity = useCallback(
    (tripId: string, input: ActivityInput): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) =>
          sortActivities({
            ...trip,
            activities: [...trip.activities, { id: newId(), ...input }],
          }),
        ),
      }))
    },
    [commit],
  )

  const updateActivity = useCallback(
    (tripId: string, activityId: string, input: ActivityInput): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) =>
          sortActivities({
            ...trip,
            activities: trip.activities.map((activity) =>
              activity.id === activityId ? { ...activity, ...input } : activity,
            ),
          }),
        ),
      }))
    },
    [commit],
  )

  const deleteActivity = useCallback(
    (tripId: string, activityId: string): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) => ({
          ...trip,
          activities: trip.activities.filter(
            (activity) => activity.id !== activityId,
          ),
        })),
      }))
    },
    [commit],
  )

  const addPackingItem = useCallback(
    (tripId: string, text: string): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) => ({
          ...trip,
          packingItems: [
            ...trip.packingItems,
            { id: newId(), text, done: false },
          ],
        })),
      }))
    },
    [commit],
  )

  const togglePackingItem = useCallback(
    (tripId: string, itemId: string): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) => ({
          ...trip,
          packingItems: trip.packingItems.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item,
          ),
        })),
      }))
    },
    [commit],
  )

  const deletePackingItem = useCallback(
    (tripId: string, itemId: string): void => {
      commit((current) => ({
        ...current,
        trips: updateTripById(current.trips, tripId, (trip) => ({
          ...trip,
          packingItems: trip.packingItems.filter((item) => item.id !== itemId),
        })),
      }))
    },
    [commit],
  )

  const store = useMemo<TripStore>(
    () => ({
      trips: state.trips,
      getTrip,
      addTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      addPackingItem,
      togglePackingItem,
      deletePackingItem,
    }),
    [
      state.trips,
      getTrip,
      addTrip,
      updateTrip,
      deleteTrip,
      addActivity,
      updateActivity,
      deleteActivity,
      addPackingItem,
      togglePackingItem,
      deletePackingItem,
    ],
  )

  return <TripContext.Provider value={store}>{children}</TripContext.Provider>
}

export function useTrips(): TripStore {
  const store = useContext(TripContext)
  if (!store) {
    throw new Error('useTrips must be used inside a <TripProvider>')
  }
  return store
}
