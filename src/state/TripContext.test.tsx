import { beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { STORAGE_KEY } from './storage'
import { TripProvider, useTrips } from './TripContext'

const wrapper = ({ children }: { children: ReactNode }) => (
  <TripProvider>{children}</TripProvider>
)

function mountStore() {
  return renderHook(() => useTrips(), { wrapper })
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('TripContext', () => {
  it('adds, updates and deletes a trip including the cascade', () => {
    const { result } = mountStore()

    let id = ''
    act(() => {
      id = result.current.addTrip({
        destination: 'Lissabon',
        startDate: '2025-05-12',
        endDate: '2025-05-18',
      }).id
    })
    expect(result.current.trips).toHaveLength(1)
    expect(result.current.getTrip(id)?.destination).toBe('Lissabon')

    act(() => {
      result.current.updateTrip(id, {
        destination: 'Porto',
        startDate: '2025-05-13',
        endDate: '2025-05-19',
      })
    })
    expect(result.current.getTrip(id)?.destination).toBe('Porto')
    expect(result.current.getTrip(id)?.startDate).toBe('2025-05-13')

    act(() => {
      result.current.addActivity(id, {
        time: '09:30',
        place: 'Markt',
        cost: 12.5,
        category: 'Verpflegung',
        date: '2025-05-13',
      })
    })
    act(() => {
      result.current.addPackingItem(id, 'Zahnbürste')
    })
    expect(result.current.getTrip(id)?.activities).toHaveLength(1)
    expect(result.current.getTrip(id)?.packingItems).toHaveLength(1)

    act(() => {
      result.current.deleteTrip(id)
    })
    expect(result.current.trips).toHaveLength(0)
    expect(result.current.getTrip(id)).toBeUndefined()
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toContain('Zahnbürste')
  })

  it('sorts trips by start date ascending', () => {
    const { result } = mountStore()

    act(() => {
      result.current.addTrip({
        destination: 'Später',
        startDate: '2025-06-01',
        endDate: '2025-06-05',
      })
    })
    act(() => {
      result.current.addTrip({
        destination: 'Früher',
        startDate: '2025-04-01',
        endDate: '2025-04-05',
      })
    })

    expect(result.current.trips.map((trip) => trip.destination)).toEqual([
      'Früher',
      'Später',
    ])
  })

  it('persists trips, activities and packing items across a reload', () => {
    const first = mountStore()

    let id = ''
    act(() => {
      id = first.result.current.addTrip({
        destination: 'Rom',
        startDate: '2025-03-10',
        endDate: '2025-03-15',
      }).id
    })
    act(() => {
      first.result.current.addActivity(id, {
        time: '18:00',
        place: 'Trattoria',
        cost: 24,
        category: 'Verpflegung',
        date: '2025-03-10',
      })
    })
    act(() => {
      first.result.current.addPackingItem(id, 'Pass')
    })
    act(() => {
      first.result.current.togglePackingItem(id, first.result.current.getTrip(id)!.packingItems[0].id)
    })
    first.unmount()

    const second = mountStore()
    const trip = second.result.current.getTrip(id)
    expect(trip).toBeDefined()
    expect(trip?.activities).toHaveLength(1)
    expect(trip?.activities[0].place).toBe('Trattoria')
    expect(trip?.packingItems).toHaveLength(1)
    expect(trip?.packingItems[0]).toMatchObject({ text: 'Pass', done: true })
  })

  it('starts empty when localStorage content is corrupt', () => {
    window.localStorage.setItem(STORAGE_KEY, '{ this is not valid json')

    const { result } = mountStore()
    expect(result.current.trips).toEqual([])
  })

  it('starts empty when stored content is implausible', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, trips: [{ id: 'x', destination: 42 }] }),
    )

    const { result } = mountStore()
    expect(result.current.trips).toEqual([])
  })
})
