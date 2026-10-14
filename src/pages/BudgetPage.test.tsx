import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { BudgetPage } from './BudgetPage'
import { TripProvider, useTrips } from '../state/TripContext'
import { STORAGE_KEY } from '../state/storage'
import { formatMoney } from '../lib/format'
import type { Activity } from '../types'

const TRIP_ID = 'trip-1'

function seedTrip(activities: Activity[] = []) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      trips: [
        {
          id: TRIP_ID,
          destination: 'Lissabon',
          startDate: '2025-05-12',
          endDate: '2025-05-18',
          activities,
          packingItems: [],
        },
      ],
    }),
  )
}

function AddActivityButton() {
  const { addActivity } = useTrips()
  return (
    <button
      type="button"
      onClick={() =>
        addActivity(TRIP_ID, {
          time: '10:00',
          place: 'Museum',
          cost: 50,
          category: 'Aktivität',
        })
      }
    >
      Aktivität hinzufügen
    </button>
  )
}

function renderBudget() {
  return render(
    <TripProvider>
      <MemoryRouter initialEntries={[`/trips/${TRIP_ID}/budget`]}>
        <Routes>
          <Route
            path="/trips/:id/budget"
            element={
              <>
                <BudgetPage />
                <AddActivityButton />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </TripProvider>,
  )
}

function totalText(container: HTMLElement): string {
  return (
    container.querySelector('.budget-chart__total-value')?.textContent ?? ''
  )
}

function barWidth(categoryLabel: string): string | undefined {
  const track = screen.getByRole('img', { name: categoryLabel })
  const bar = track.querySelector('.budget-chart__bar')
  return bar instanceof HTMLElement ? bar.style.width : undefined
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('BudgetPage', () => {
  it('shows 0,00 € and empty bars without any activity', () => {
    seedTrip()
    const { container } = renderBudget()

    expect(totalText(container)).toBe(formatMoney(0))

    for (const category of ['Anreise', 'Unterkunft', 'Verpflegung', 'Aktivität', 'Shopping', 'Sonstiges']) {
      const track = screen.getByRole('img', {
        name: `${category}: ${formatMoney(0)}`,
      })
      expect(track.querySelector('.budget-chart__bar')).toBeNull()
      expect(track.querySelector('.budget-chart__hairline')).not.toBeNull()
    }
  })

  it('grows total, category sum and bar width as soon as an activity is added', () => {
    seedTrip([
      { id: 'a', time: '09:00', place: 'Café', cost: 20, category: 'Verpflegung' },
    ])
    const { container } = renderBudget()

    expect(totalText(container)).toBe(formatMoney(20))
    expect(barWidth(`Verpflegung: ${formatMoney(20)}`)).toBe('100%')

    fireEvent.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))

    expect(totalText(container)).toBe(formatMoney(70))
    expect(barWidth(`Aktivität: ${formatMoney(50)}`)).toBe('100%')
    expect(barWidth(`Verpflegung: ${formatMoney(20)}`)).toBe('40%')
    expect(
      screen.getByRole('img', { name: `Aktivität: ${formatMoney(50)}` }),
    ).toBeInTheDocument()
  })
})
