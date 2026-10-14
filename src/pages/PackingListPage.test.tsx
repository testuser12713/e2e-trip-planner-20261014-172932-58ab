import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PackingListPage } from './PackingListPage'
import { TripProvider } from '../state/TripContext'
import { STORAGE_KEY } from '../state/storage'
import type { AppState, Trip } from '../types'

const TRIP_ID = 'trip-lissabon'
const OTHER_TRIP_ID = 'trip-rom'

function trip(
  id: string,
  destination: string,
  packingItems: Trip['packingItems'] = [],
): Trip {
  return {
    id,
    destination,
    startDate: '2025-05-12',
    endDate: '2025-05-18',
    activities: [],
    packingItems,
  }
}

function seed(trips: Trip[]) {
  const state: AppState = { version: 1, trips }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function renderPacking(tripId: string = TRIP_ID) {
  return render(
    <TripProvider>
      <MemoryRouter initialEntries={[`/trips/${tripId}/packing`]}>
        <Routes>
          <Route path="/trips/:id/packing" element={<PackingListPage />} />
        </Routes>
      </MemoryRouter>
    </TripProvider>,
  )
}

async function addItem(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByPlaceholderText('z. B. Zahnbürste'), text)
  await user.click(screen.getByRole('button', { name: 'Hinzufügen' }))
}

beforeEach(() => {
  window.localStorage.clear()
  seed([trip(TRIP_ID, 'Lissabon'), trip(OTHER_TRIP_ID, 'Rom')])
})

describe('PackingListPage', () => {
  it('adds an entry and updates the counter', async () => {
    const user = userEvent.setup()
    renderPacking()

    expect(screen.getByText('0 von 0')).toBeInTheDocument()

    await addItem(user, 'Zahnbürste')

    expect(screen.getByText('Zahnbürste')).toBeInTheDocument()
    expect(screen.getByText('0 von 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('z. B. Zahnbürste')).toHaveValue('')
  })

  it('checks and unchecks an entry with a visible done state', async () => {
    const user = userEvent.setup()
    seed([
      trip(TRIP_ID, 'Lissabon', [{ id: 'p1', text: 'Pass', done: false }]),
      trip(OTHER_TRIP_ID, 'Rom'),
    ])
    renderPacking()

    const checkbox = screen.getByRole('checkbox', { name: 'Pass' })
    expect(checkbox).not.toBeChecked()
    expect(screen.getByText('0 von 1')).toBeInTheDocument()

    await user.click(checkbox)

    expect(screen.getByRole('checkbox', { name: 'Pass' })).toBeChecked()
    expect(screen.getByText('1 von 1')).toBeInTheDocument()
    expect(screen.getByText('Alles gepackt')).toBeInTheDocument()
    expect(screen.getByText('Pass').closest('li')).toHaveAttribute(
      'data-done',
      'true',
    )

    await user.click(screen.getByRole('checkbox', { name: 'Pass' }))

    expect(screen.getByRole('checkbox', { name: 'Pass' })).not.toBeChecked()
    expect(screen.getByText('0 von 1')).toBeInTheDocument()
    expect(screen.getByText('Pass').closest('li')).toHaveAttribute(
      'data-done',
      'false',
    )
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    seed([
      trip(TRIP_ID, 'Lissabon', [{ id: 'p1', text: 'Pass', done: false }]),
      trip(OTHER_TRIP_ID, 'Rom'),
    ])
    renderPacking()

    await user.click(
      screen.getByRole('button', { name: 'Eintrag löschen: Pass' }),
    )

    expect(screen.queryByText('Pass')).not.toBeInTheDocument()
    expect(screen.getByText('0 von 0')).toBeInTheDocument()
    expect(screen.getByText('Deine Packliste ist noch leer.')).toBeInTheDocument()
  })

  it('keeps the counter and the done state across a reload', async () => {
    const user = userEvent.setup()
    const first = renderPacking()

    await addItem(user, 'Zahnbürste')
    await user.click(screen.getByRole('checkbox', { name: 'Zahnbürste' }))
    expect(screen.getByText('1 von 1')).toBeInTheDocument()

    first.unmount()

    renderPacking()
    expect(screen.getByRole('checkbox', { name: 'Zahnbürste' })).toBeChecked()
    expect(screen.getByText('1 von 1')).toBeInTheDocument()
    expect(screen.getByText('Alles gepackt')).toBeInTheDocument()
  })

  it('shows the German field error only after submit or touch', async () => {
    const user = userEvent.setup()
    renderPacking()

    const input = screen.getByPlaceholderText('z. B. Zahnbürste')
    expect(screen.queryByText('Bitte einen Eintrag eingeben.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hinzufügen' }))
    expect(screen.getByText('Bitte einen Eintrag eingeben.')).toBeInTheDocument()
    expect(screen.getByText('0 von 0')).toBeInTheDocument()

    await user.type(input, 'Pass')
    expect(screen.queryByText('Bitte einen Eintrag eingeben.')).not.toBeInTheDocument()
  })

  it('never shows the entries of another trip', () => {
    seed([
      trip(TRIP_ID, 'Lissabon', [{ id: 'p1', text: 'Pass', done: false }]),
      trip(OTHER_TRIP_ID, 'Rom', [
        { id: 'p2', text: 'Strandtuch', done: false },
      ]),
    ])
    renderPacking()

    expect(screen.getByText('Pass')).toBeInTheDocument()
    expect(screen.queryByText('Strandtuch')).not.toBeInTheDocument()
  })
})
