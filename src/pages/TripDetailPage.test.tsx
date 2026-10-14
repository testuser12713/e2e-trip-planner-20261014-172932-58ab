import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TripDetailPage } from './TripDetailPage'
import { TripProvider } from '../state/TripContext'
import { STORAGE_KEY } from '../state/storage'
import type { Activity, AppState, Trip } from '../types'

const TRIP_ID = 't1'
const DAY_ONE = '2025-05-12'
const DAY_TWO = '2025-05-13'

function makeTrip(activities: Activity[] = []): Trip {
  return {
    id: TRIP_ID,
    destination: 'Lissabon',
    startDate: DAY_ONE,
    endDate: '2025-05-14',
    activities,
    packingItems: [],
  }
}

function activity(overrides: Partial<Activity> & Pick<Activity, 'time' | 'place'>): Activity {
  return {
    id: `${overrides.time}-${overrides.place}`,
    cost: 10,
    category: 'Verpflegung',
    date: DAY_ONE,
    ...overrides,
  }
}

function seed(trip: Trip) {
  const state: AppState = { version: 1, trips: [trip] }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function renderPage() {
  return render(
    <TripProvider>
      <MemoryRouter initialEntries={[`/trips/${TRIP_ID}`]}>
        <Routes>
          <Route path="/trips/:id" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>
    </TripProvider>,
  )
}

function fillForm(fields: {
  time?: string
  place?: string
  cost?: string
  category?: string
}) {
  if (fields.time !== undefined) {
    fireEvent.change(screen.getByLabelText('Uhrzeit'), {
      target: { value: fields.time },
    })
  }
  if (fields.place !== undefined) {
    fireEvent.change(screen.getByLabelText('Ort'), {
      target: { value: fields.place },
    })
  }
  if (fields.cost !== undefined) {
    fireEvent.change(screen.getByLabelText('Kosten (€)'), {
      target: { value: fields.cost },
    })
  }
  if (fields.category !== undefined) {
    fireEvent.change(screen.getByLabelText('Kategorie'), {
      target: { value: fields.category },
    })
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('TripDetailPage — day plan', () => {
  it('shows the days of the trip as selectable tabs and switches the shown plan', async () => {
    const user = userEvent.setup()
    seed(
      makeTrip([
        activity({ time: '09:00', place: 'Markt', date: DAY_ONE }),
        activity({ time: '14:00', place: 'Museum', date: DAY_TWO }),
      ]),
    )
    renderPage()

    expect(screen.getByRole('tab', { name: /Tag 1/ })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: /Tag 2/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Tag 3/ })).toBeInTheDocument()

    expect(screen.getByText('Markt')).toBeInTheDocument()
    expect(screen.queryByText('Museum')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: /Tag 2/ }))

    expect(screen.getByText('Museum')).toBeInTheDocument()
    expect(screen.queryByText('Markt')).not.toBeInTheDocument()
  })

  it('places a new activity at its time-sorted position', async () => {
    const user = userEvent.setup()
    seed(makeTrip([activity({ time: '12:00', place: 'Mittagessen', date: DAY_ONE })]))
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))

    fillForm({ time: '09:00', place: 'Frühstück', cost: '5', category: 'Verpflegung' })
    await user.click(screen.getByRole('button', { name: 'Aktivität speichern' }))

    const rows = screen.getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('Frühstück')
    expect(rows[1]).toHaveTextContent('Mittagessen')
  })

  it('edits an activity in place and takes effect immediately', async () => {
    const user = userEvent.setup()
    seed(makeTrip([activity({ time: '09:00', place: 'Markt', date: DAY_ONE })]))
    renderPage()

    const row = screen.getByText('Markt').closest('li') as HTMLElement
    await user.click(within(row).getByRole('button', { name: 'Bearbeiten' }))

    expect(screen.getByLabelText('Ort')).toHaveValue('Markt')
    fillForm({ place: 'Supermarkt' })
    await user.click(screen.getByRole('button', { name: 'Aktivität speichern' }))

    expect(screen.getByText('Supermarkt')).toBeInTheDocument()
    expect(screen.queryByText('Markt')).not.toBeInTheDocument()
  })

  it('deletes an activity only after confirmation', async () => {
    const user = userEvent.setup()
    seed(makeTrip([activity({ time: '09:00', place: 'Markt', date: DAY_ONE })]))
    renderPage()

    const row = screen.getByText('Markt').closest('li') as HTMLElement
    await user.click(within(row).getByRole('button', { name: 'Löschen' }))

    // Opening the confirmation alone does not remove anything yet.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Markt')).toBeInTheDocument()

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Löschen' }))

    expect(screen.queryByText('Markt')).not.toBeInTheDocument()
    expect(
      screen.getByText('Für diesen Tag ist noch nichts geplant.'),
    ).toBeInTheDocument()
  })

  it('keeps the day plan untouched when the delete is cancelled', async () => {
    const user = userEvent.setup()
    seed(makeTrip([activity({ time: '09:00', place: 'Markt', date: DAY_ONE })]))
    renderPage()

    const row = screen.getByText('Markt').closest('li') as HTMLElement
    await user.click(within(row).getByRole('button', { name: 'Löschen' }))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Abbrechen' }))

    expect(screen.getByText('Markt')).toBeInTheDocument()
  })
})

describe('TripDetailPage — activity form validation', () => {
  it('shows no field errors on an untouched form', async () => {
    const user = userEvent.setup()
    seed(makeTrip())
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))

    expect(
      screen.queryByText('Bitte eine gültige Uhrzeit im Format HH:MM angeben.'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('Die Kosten müssen eine Zahl ab 0 sein.'),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Bitte eine Kategorie wählen.')).not.toBeInTheDocument()
  })

  it('blocks the save and reports German field errors after a submit', async () => {
    const user = userEvent.setup()
    seed(makeTrip([activity({ time: '12:00', place: 'Mittagessen', date: DAY_ONE })]))
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))
    fillForm({ time: '25:99', place: 'Test', cost: '-3', category: '' })
    await user.click(screen.getByRole('button', { name: 'Aktivität speichern' }))

    expect(
      screen.getByText('Bitte eine gültige Uhrzeit im Format HH:MM angeben.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Die Kosten müssen eine Zahl ab 0 sein.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Bitte eine Kategorie wählen.')).toBeInTheDocument()

    // Cancel the form: nothing was stored.
    await user.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.getAllByRole('listitem')).toHaveLength(1)
  })
})
