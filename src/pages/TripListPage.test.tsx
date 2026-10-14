import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TripListPage } from './TripListPage'
import { TripProvider } from '../state/TripContext'

function renderPage() {
  return render(
    <TripProvider>
      <MemoryRouter initialEntries={['/']}>
        <TripListPage />
      </MemoryRouter>
    </TripProvider>,
  )
}

function fillCreateForm(
  destination: string,
  startDate = '2025-05-12',
  endDate = '2025-05-18',
) {
  fireEvent.change(screen.getByLabelText('Ziel'), { target: { value: destination } })
  fireEvent.change(screen.getByLabelText('Startdatum'), {
    target: { value: startDate },
  })
  fireEvent.change(screen.getByLabelText('Enddatum'), { target: { value: endDate } })
}

beforeEach(() => {
  window.localStorage.clear()
})

describe('TripListPage', () => {
  it('shows an inviting empty state that points at the create form', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Noch keine Reisen geplant' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Erste Reise anlegen' })).toBeInTheDocument()
    expect(screen.getByLabelText('Ziel')).toBeInTheDocument()
  })

  it('creates a trip that appears immediately with destination and period', async () => {
    const user = userEvent.setup()
    renderPage()

    fillCreateForm('Lissabon')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    expect(screen.getByRole('heading', { name: 'Lissabon' })).toBeInTheDocument()
    expect(screen.getByText('12.05.2025 – 18.05.2025')).toBeInTheDocument()
    expect(screen.queryByText('Noch keine Reisen geplant')).not.toBeInTheDocument()
  })

  it('lists trips sorted by start date', async () => {
    const user = userEvent.setup()
    renderPage()

    fillCreateForm('Später', '2025-06-01', '2025-06-05')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    fillCreateForm('Früher', '2025-04-01', '2025-04-05')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    const headings = screen.getAllByRole('heading', { level: 2 })
    const destinations = headings
      .map((node) => node.textContent)
      .filter((text) => text === 'Früher' || text === 'Später')
    expect(destinations).toEqual(['Früher', 'Später'])
  })

  it('deletes a trip only after the confirmation is accepted', async () => {
    const user = userEvent.setup()
    renderPage()

    fillCreateForm('Lissabon')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    await user.click(screen.getByRole('button', { name: 'Reise Lissabon löschen' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lissabon' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Löschen' }))

    expect(screen.queryByRole('heading', { name: 'Lissabon' })).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps the trip when the confirmation is cancelled', async () => {
    const user = userEvent.setup()
    renderPage()

    fillCreateForm('Lissabon')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    await user.click(screen.getByRole('button', { name: 'Reise Lissabon löschen' }))
    await user.click(screen.getByRole('button', { name: 'Abbrechen' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lissabon' })).toBeInTheDocument()
  })

  it('still shows the trip after a reload', async () => {
    const user = userEvent.setup()
    const first = renderPage()

    fillCreateForm('Rom')
    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))
    first.unmount()

    renderPage()

    expect(screen.getByRole('heading', { name: 'Rom' })).toBeInTheDocument()
    expect(screen.getByText('12.05.2025 – 18.05.2025')).toBeInTheDocument()
  })
})
