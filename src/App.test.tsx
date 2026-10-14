import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { TripProvider } from './state/TripContext'

function renderApp(path: string) {
  return render(
    <TripProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </TripProvider>,
  )
}

describe('App shell', () => {
  it('renders the shell with its navigation to the trip list', () => {
    renderApp('/')

    expect(screen.getByRole('banner')).toBeInTheDocument()

    const nav = screen.getByRole('navigation', { name: 'Hauptnavigation' })
    expect(nav).toBeInTheDocument()

    const tripListLink = screen.getByRole('link', { name: 'Reiseliste' })
    expect(tripListLink).toHaveAttribute('href', '/')

    const wordmark = screen.getByRole('link', { name: 'Reiseplaner' })
    expect(wordmark).toHaveAttribute('href', '/')
  })

  it('shows the 404 page with a link back for an unknown path', () => {
    renderApp('/diese-seite-existiert-nicht')

    expect(
      screen.getByRole('heading', { name: 'Diese Seite gibt es nicht.' }),
    ).toBeInTheDocument()

    const backLink = screen.getByRole('link', {
      name: 'Zurück zur Reiseliste',
    })
    expect(backLink).toHaveAttribute('href', '/')
  })

  it('renders the 404 page for an unknown trip id under a trip route', () => {
    renderApp('/trips/unbekannte-id/budget')

    expect(
      screen.getByRole('heading', { name: 'Diese Seite gibt es nicht.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reiseliste' })).toHaveAttribute(
      'href',
      '/',
    )
  })
})
