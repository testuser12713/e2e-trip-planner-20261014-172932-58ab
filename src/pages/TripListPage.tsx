import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { TripForm } from '../components/TripForm'
import { formatDate } from '../lib/format'
import { useTrips } from '../state/TripContext'
import type { Trip, TripInput } from '../types'

function activityLabel(count: number): string {
  return count === 1 ? '1 Aktivität' : `${count} Aktivitäten`
}

function packingLabel(count: number): string {
  return count === 1 ? '1 Eintrag auf der Packliste' : `${count} Einträge auf der Packliste`
}

interface TripCardProps {
  trip: Trip
  onDelete: (trip: Trip) => void
}

function TripCard({ trip, onDelete }: TripCardProps) {
  const detailPath = `/trips/${trip.id}`

  return (
    <li className="card trip-card">
      <div className="trip-card__main">
        <Link to={detailPath} className="trip-card__open">
          <h2 className="trip-card__title">{trip.destination}</h2>
        </Link>
        <p className="trip-card__dates">
          {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
        </p>
        <p className="trip-card__meta">
          {activityLabel(trip.activities.length)} · {packingLabel(trip.packingItems.length)}
        </p>
      </div>

      <div className="trip-card__actions">
        <Link to={detailPath} className="btn btn-secondary">
          Öffnen
        </Link>
        <Link
          to={`${detailPath}/edit`}
          className="btn btn-ghost"
          aria-label={`Reise ${trip.destination} umbenennen`}
        >
          Umbenennen
        </Link>
        <button
          type="button"
          className="btn btn-ghost btn-danger-text"
          aria-label={`Reise ${trip.destination} löschen`}
          onClick={() => onDelete(trip)}
        >
          Löschen
        </button>
      </div>
    </li>
  )
}

export function TripListPage() {
  const { trips, addTrip, deleteTrip } = useTrips()
  const [createFormKey, setCreateFormKey] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<Trip | null>(null)
  const destinationRef = useRef<HTMLInputElement>(null)

  function handleCreate(input: TripInput) {
    addTrip(input)
    setCreateFormKey((value) => value + 1)
  }

  function focusCreateForm() {
    destinationRef.current?.focus()
    destinationRef.current?.scrollIntoView?.({ block: 'center' })
  }

  function handleConfirmDelete() {
    if (pendingDelete) {
      deleteTrip(pendingDelete.id)
    }
    setPendingDelete(null)
  }

  return (
    <section className="trip-list">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Deine Reisen</h1>
          <p className="page-header__subtitle">
            Plane Ziele, Tage, Budget und Packliste – alles bleibt in diesem Browser.
          </p>
        </div>
      </div>

      <div className="card trip-list__form-card">
        <h2 className="trip-list__form-title">Neue Reise anlegen</h2>
        <TripForm
          key={createFormKey}
          submitLabel="Reise speichern"
          onSubmit={handleCreate}
          destinationRef={destinationRef}
        />
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <svg
            className="empty-state__art"
            viewBox="0 0 64 64"
            role="img"
            aria-hidden="true"
            focusable="false"
          >
            <rect
              x="8"
              y="20"
              width="48"
              height="30"
              rx="6"
              fill="none"
              stroke="#0E7C86"
              strokeWidth="2"
            />
            <path
              d="M24 20v-5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v5"
              fill="none"
              stroke="#C9CED6"
              strokeWidth="2"
            />
            <path d="M8 33h48" stroke="#C9CED6" strokeWidth="2" />
            <path d="M26 38h12" stroke="#0E7C86" strokeWidth="2" />
          </svg>
          <h2 className="empty-state__title">Noch keine Reisen geplant</h2>
          <p className="empty-state__text">
            Deine Reisen werden nur in diesem Browser gespeichert. Lege unten deine erste Reise
            mit Ziel, Start- und Enddatum an – sie erscheint danach sofort in dieser Liste.
          </p>
          <button type="button" className="btn btn-primary" onClick={focusCreateForm}>
            Erste Reise anlegen
          </button>
        </div>
      ) : (
        <ul className="trip-list__items">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={(selected) => setPendingDelete(selected)}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={
          pendingDelete
            ? `Reise „${pendingDelete.destination}“ löschen?`
            : 'Reise löschen?'
        }
        message="Alle Aktivitäten und Packlisteneinträge dieser Reise werden ebenfalls entfernt. Das lässt sich nicht rückgängig machen."
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </section>
  )
}
