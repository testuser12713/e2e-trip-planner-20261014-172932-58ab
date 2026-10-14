import { useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useTrips } from '../state/TripContext'
import { packingProgress, validatePackingText } from '../lib/packing'
import styles from './PackingListPage.module.css'

export function PackingListPage() {
  const { id } = useParams<{ id: string }>()
  const { getTrip, addPackingItem, togglePackingItem, deletePackingItem } =
    useTrips()

  const [text, setText] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const trip = id ? getTrip(id) : undefined

  if (!trip) {
    return null
  }

  const tripId = trip.id
  const items = trip.packingItems
  const { done, total } = packingProgress(items)
  const error = validatePackingText(text)
  const showError = (touched || submitted) && error !== null
  const ratio = total === 0 ? 0 : done / total
  const complete = total > 0 && done === total

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    if (validatePackingText(text) !== null) {
      return
    }
    addPackingItem(tripId, text.trim())
    setText('')
    setTouched(false)
    setSubmitted(false)
  }

  return (
    <section className={styles.packing}>
      <div className={`card ${styles.card}`}>
        <div className={styles.progress}>
          <div className={styles.progressHead}>
            <span className={styles.progressLabel}>
              {complete ? 'Alles gepackt' : 'Gepackt'}
            </span>
            <span className={styles.progressCount}>{`${done} von ${total}`}</span>
          </div>
          <div
            className={styles.track}
            role="progressbar"
            aria-label="Packfortschritt"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={Math.max(total, 1)}
          >
            <div
              className={
                complete ? `${styles.fill} ${styles.fillComplete}` : styles.fill
              }
              style={{ width: `${ratio * 100}%`, minWidth: done > 0 ? 8 : 0 }}
            />
          </div>
        </div>

        <form className={styles.addRow} onSubmit={handleSubmit} noValidate>
          <div className={styles.addField}>
            <label className={styles.srOnly} htmlFor="packing-new">
              Neuer Packlisteneintrag
            </label>
            <input
              id="packing-new"
              className={styles.input}
              type="text"
              placeholder="z. B. Zahnbürste"
              value={text}
              aria-invalid={showError}
              aria-describedby={showError ? 'packing-new-error' : undefined}
              onChange={(event) => setText(event.target.value)}
              onBlur={() => setTouched(true)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Hinzufügen
          </button>
        </form>

        {showError && (
          <p className={styles.error} id="packing-new-error">
            <svg
              className={styles.errorIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M8 1.6 15 14H1z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M8 6v4" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="12" r="0.9" fill="currentColor" />
            </svg>
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <p className={styles.empty}>Deine Packliste ist noch leer.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li
                key={item.id}
                className={styles.row}
                data-done={item.done ? 'true' : 'false'}
              >
                <input
                  id={`packing-item-${item.id}`}
                  className={styles.srOnly}
                  type="checkbox"
                  checked={item.done}
                  onChange={() => togglePackingItem(tripId, item.id)}
                />
                <label
                  className={styles.rowMain}
                  htmlFor={`packing-item-${item.id}`}
                >
                  <span className={styles.box} aria-hidden="true">
                    <svg viewBox="0 0 16 16" focusable="false">
                      <path
                        d="M3 8.5 6.5 12 13 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                  <span className={styles.rowText}>{item.text}</span>
                </label>
                <button
                  type="button"
                  className={`btn btn-ghost btn-danger-text ${styles.deleteButton}`}
                  aria-label={`Eintrag löschen: ${item.text}`}
                  onClick={() => deletePackingItem(tripId, item.id)}
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="M3 4h10M6.5 4V3h3v1M4.5 4l.6 9h5.8l.6-9"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
