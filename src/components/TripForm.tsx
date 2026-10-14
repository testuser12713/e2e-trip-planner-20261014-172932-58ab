import { useId, useState } from 'react'
import type { FormEvent, Ref } from 'react'
import type { TripInput } from '../types'
import { hasTripErrors, validateTripInput } from '../lib/tripValidation'

export interface TripFormProps {
  initialValues?: TripInput
  submitLabel: string
  onSubmit: (input: TripInput) => void
  onCancel?: () => void
  cancelLabel?: string
  destinationRef?: Ref<HTMLInputElement>
}

type FieldName = keyof TripInput

const EMPTY_VALUES: TripInput = {
  destination: '',
  startDate: '',
  endDate: '',
}

const INITIAL_TOUCHED: Record<FieldName, boolean> = {
  destination: false,
  startDate: false,
  endDate: false,
}

export function TripForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Abbrechen',
  destinationRef,
}: TripFormProps) {
  const formId = useId()
  const [values, setValues] = useState<TripInput>(initialValues ?? EMPTY_VALUES)
  const [touched, setTouched] = useState<Record<FieldName, boolean>>(INITIAL_TOUCHED)
  const [submitted, setSubmitted] = useState(false)

  const errors = validateTripInput(values)

  function errorFor(field: FieldName): string | undefined {
    if (!submitted && !touched[field]) return undefined
    return errors[field]
  }

  function handleChange(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleBlur(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (hasTripErrors(validateTripInput(values))) return
    onSubmit({ ...values, destination: values.destination.trim() })
  }

  function inputId(field: FieldName): string {
    return `${formId}-${field}`
  }

  function errorId(field: FieldName): string {
    return `${formId}-${field}-error`
  }

  function inputClass(field: FieldName): string {
    return errorFor(field)
      ? 'form-field__input form-field__input--error'
      : 'form-field__input'
  }

  function renderError(field: FieldName) {
    const message = errorFor(field)
    if (!message) return null
    return (
      <p className="form-field__error" id={errorId(field)}>
        <span className="form-field__error-icon" aria-hidden="true">
          {'\u26A0'}
        </span>
        {message}
      </p>
    )
  }

  return (
    <form className="trip-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label className="form-field__label" htmlFor={inputId('destination')}>
          Ziel
        </label>
        <input
          id={inputId('destination')}
          ref={destinationRef}
          className={inputClass('destination')}
          type="text"
          value={values.destination}
          placeholder="z. B. Lissabon"
          aria-invalid={errorFor('destination') ? true : undefined}
          aria-describedby={errorFor('destination') ? errorId('destination') : undefined}
          onChange={(event) => handleChange('destination', event.target.value)}
          onBlur={() => handleBlur('destination')}
        />
        {renderError('destination')}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor={inputId('startDate')}>
          Startdatum
        </label>
        <input
          id={inputId('startDate')}
          className={inputClass('startDate')}
          type="date"
          value={values.startDate}
          aria-invalid={errorFor('startDate') ? true : undefined}
          aria-describedby={errorFor('startDate') ? errorId('startDate') : undefined}
          onChange={(event) => handleChange('startDate', event.target.value)}
          onBlur={() => handleBlur('startDate')}
        />
        {renderError('startDate')}
      </div>

      <div className="form-field">
        <label className="form-field__label" htmlFor={inputId('endDate')}>
          Enddatum
        </label>
        <input
          id={inputId('endDate')}
          className={inputClass('endDate')}
          type="date"
          value={values.endDate}
          aria-invalid={errorFor('endDate') ? true : undefined}
          aria-describedby={errorFor('endDate') ? errorId('endDate') : undefined}
          onChange={(event) => handleChange('endDate', event.target.value)}
          onBlur={() => handleBlur('endDate')}
        />
        {renderError('endDate')}
      </div>

      <div className="trip-form__actions">
        {onCancel ? (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
