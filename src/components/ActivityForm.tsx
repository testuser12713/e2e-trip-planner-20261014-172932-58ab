import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Activity, ActivityInput } from '../types'
import { CATEGORIES } from '../types'
import {
  activityToFormValues,
  formValuesToActivityInput,
  validateActivity,
} from '../lib/activityValidation'
import type { ActivityFormErrors, ActivityFormValues } from '../lib/activityValidation'

export interface ActivityFormProps {
  initial?: Activity
  onSubmit: (input: ActivityInput) => void
  onCancel: () => void
}

const EMPTY_VALUES: ActivityFormValues = {
  time: '',
  place: '',
  cost: '',
  category: '',
}

type FieldName = keyof ActivityFormErrors

export function ActivityForm({ initial, onSubmit, onCancel }: ActivityFormProps) {
  const [values, setValues] = useState<ActivityFormValues>(() =>
    initial ? activityToFormValues(initial) : EMPTY_VALUES,
  )
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errors = validateActivity(values)

  function showError(field: FieldName): string | undefined {
    if (!touched[field] && !submitted) return undefined
    return errors[field]
  }

  function setField<K extends keyof ActivityFormValues>(
    field: K,
    value: ActivityFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    const input = formValuesToActivityInput(values)
    if (!input) return
    onSubmit(input)
  }

  const timeError = showError('time')
  const costError = showError('cost')
  const categoryError = showError('category')

  return (
    <form className="card activity-form" onSubmit={handleSubmit} noValidate>
      <h2 className="activity-form__title">
        {initial ? 'Aktivität bearbeiten' : 'Neue Aktivität'}
      </h2>

      <div className="activity-form__fields">
        <div className="field">
          <label className="field__label" htmlFor="activity-time">
            Uhrzeit
          </label>
          <input
            id="activity-time"
            className={timeError ? 'field__input field__input--error' : 'field__input'}
            type="time"
            value={values.time}
            placeholder="HH:MM"
            aria-invalid={timeError ? true : undefined}
            aria-describedby={timeError ? 'activity-time-error' : undefined}
            onBlur={() => setTouched((current) => ({ ...current, time: true }))}
            onChange={(event) => setField('time', event.target.value)}
          />
          {timeError && (
            <p className="field__error" id="activity-time-error" role="alert">
              <span aria-hidden="true">⚠</span> {timeError}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="activity-place">
            Ort
          </label>
          <input
            id="activity-place"
            className="field__input"
            type="text"
            value={values.place}
            onChange={(event) => setField('place', event.target.value)}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor="activity-cost">
            Kosten (€)
          </label>
          <input
            id="activity-cost"
            className={
              costError
                ? 'field__input field__input--number field__input--error'
                : 'field__input field__input--number'
            }
            type="number"
            min={0}
            step={0.01}
            value={values.cost}
            aria-invalid={costError ? true : undefined}
            aria-describedby={costError ? 'activity-cost-error' : undefined}
            onBlur={() => setTouched((current) => ({ ...current, cost: true }))}
            onChange={(event) => setField('cost', event.target.value)}
          />
          {costError && (
            <p className="field__error" id="activity-cost-error" role="alert">
              <span aria-hidden="true">⚠</span> {costError}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor="activity-category">
            Kategorie
          </label>
          <select
            id="activity-category"
            className={
              categoryError
                ? 'field__input field__select field__input--error'
                : 'field__input field__select'
            }
            value={values.category}
            aria-invalid={categoryError ? true : undefined}
            aria-describedby={categoryError ? 'activity-category-error' : undefined}
            onBlur={() =>
              setTouched((current) => ({ ...current, category: true }))
            }
            onChange={(event) =>
              setField('category', event.target.value as ActivityFormValues['category'])
            }
          >
            <option value="">Bitte wählen</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {categoryError && (
            <p className="field__error" id="activity-category-error" role="alert">
              <span aria-hidden="true">⚠</span> {categoryError}
            </p>
          )}
        </div>
      </div>

      <div className="activity-form__actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Abbrechen
        </button>
        <button type="submit" className="btn btn-primary">
          Aktivität speichern
        </button>
      </div>
    </form>
  )
}
