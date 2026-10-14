import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TripForm } from './TripForm'

function renderForm(onSubmit = vi.fn()) {
  render(<TripForm submitLabel="Reise speichern" onSubmit={onSubmit} />)
  return onSubmit
}

describe('TripForm', () => {
  it('shows no error on an untouched form', () => {
    renderForm()

    expect(screen.queryByText('Bitte ein Ziel angeben.')).not.toBeInTheDocument()
    expect(screen.queryByText('Bitte ein Startdatum angeben.')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Das Enddatum darf nicht vor dem Startdatum liegen.'),
    ).not.toBeInTheDocument()
  })

  it('shows a field error after the field was touched', async () => {
    const user = userEvent.setup()
    renderForm()

    const destination = screen.getByLabelText('Ziel')
    await user.click(destination)
    await user.tab()

    expect(screen.getByText('Bitte ein Ziel angeben.')).toBeInTheDocument()
    expect(destination).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the errors after submitting an empty form and stores nothing', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm()

    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    expect(screen.getByText('Bitte ein Ziel angeben.')).toBeInTheDocument()
    expect(screen.getByText('Bitte ein Startdatum angeben.')).toBeInTheDocument()
    expect(screen.getByText('Bitte ein Enddatum angeben.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects an end date before the start date and stores nothing', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm()

    fireEvent.change(screen.getByLabelText('Ziel'), { target: { value: 'Rom' } })
    fireEvent.change(screen.getByLabelText('Startdatum'), {
      target: { value: '2025-05-18' },
    })
    fireEvent.change(screen.getByLabelText('Enddatum'), {
      target: { value: '2025-05-12' },
    })

    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    expect(
      screen.getByText('Das Enddatum darf nicht vor dem Startdatum liegen.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits valid input with a trimmed destination', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm()

    fireEvent.change(screen.getByLabelText('Ziel'), {
      target: { value: '  Lissabon  ' },
    })
    fireEvent.change(screen.getByLabelText('Startdatum'), {
      target: { value: '2025-05-12' },
    })
    fireEvent.change(screen.getByLabelText('Enddatum'), {
      target: { value: '2025-05-18' },
    })

    await user.click(screen.getByRole('button', { name: 'Reise speichern' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith({
      destination: 'Lissabon',
      startDate: '2025-05-12',
      endDate: '2025-05-18',
    })
  })
})
