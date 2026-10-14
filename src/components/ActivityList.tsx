import { useState } from 'react'
import type { Activity, Category } from '../types'
import { formatMoney } from '../lib/format'
import { ConfirmDialog } from './ConfirmDialog'

export interface ActivityListProps {
  activities: Activity[]
  onEdit: (activity: Activity) => void
  onDelete: (activity: Activity) => void
}

const CATEGORY_SLUG: Record<Category, string> = {
  Anreise: 'anreise',
  Unterkunft: 'unterkunft',
  Verpflegung: 'verpflegung',
  Aktivität: 'aktivitaet',
  Shopping: 'shopping',
  Sonstiges: 'sonstiges',
}

function sortByTime(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => {
    if (a.time !== b.time) return a.time < b.time ? -1 : 1
    return a.place.localeCompare(b.place)
  })
}

export function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  const [pendingDelete, setPendingDelete] = useState<Activity | null>(null)
  const sorted = sortByTime(activities)

  if (sorted.length === 0) {
    return (
      <div className="empty-state day-plan-empty">
        <h2 className="empty-state__title">Für diesen Tag ist noch nichts geplant.</h2>
        <p className="empty-state__text">
          Füge eine Aktivität mit Uhrzeit, Ort, Kosten und Kategorie hinzu.
        </p>
      </div>
    )
  }

  return (
    <>
      <ul className="activity-list" aria-label="Aktivitäten des Tages">
        {sorted.map((activity) => (
          <li key={activity.id} className="activity-row">
            <span className="activity-row__time">{activity.time}</span>
            <span className="activity-row__place">{activity.place || '—'}</span>
            <span
              className={`category-tag category-tag--${CATEGORY_SLUG[activity.category]}`}
            >
              {activity.category}
            </span>
            <span className="activity-row__cost">{formatMoney(activity.cost)}</span>
            <span className="activity-row__actions">
              <button
                type="button"
                className="btn btn-ghost"
                aria-label="Bearbeiten"
                onClick={() => onEdit(activity)}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M13.5 3.5l3 3L7 16l-3.5.5L4 13z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-danger-text"
                aria-label="Löschen"
                onClick={() => setPendingDelete(activity)}
              >
                <svg
                  viewBox="0 0 20 20"
                  width="18"
                  height="18"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 6h12M8 6V4h4v2M6 6l.7 10h6.6L14 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          </li>
        ))}
      </ul>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Aktivität löschen?"
        message={
          pendingDelete
            ? `„${pendingDelete.place || pendingDelete.time}“ wird endgültig entfernt.`
            : ''
        }
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) onDelete(pendingDelete)
          setPendingDelete(null)
        }}
      />
    </>
  )
}
