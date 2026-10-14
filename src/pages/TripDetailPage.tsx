import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { Activity, ActivityInput } from '../types'
import { deriveTripDays } from '../lib/dates'
import { useTrips } from '../state/TripContext'
import { DayTabs } from '../components/DayTabs'
import { ActivityList } from '../components/ActivityList'
import { ActivityForm } from '../components/ActivityForm'
import '../styles/trip-detail.css'

type FormMode = 'none' | 'create' | 'edit'

export function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getTrip, addActivity, updateActivity, deleteActivity } = useTrips()
  const trip = id ? getTrip(id) : undefined

  const days = useMemo(
    () => (trip ? deriveTripDays(trip.startDate, trip.endDate) : []),
    [trip],
  )

  const [selectedDay, setSelectedDay] = useState<string>(days[0] ?? '')
  const [mode, setMode] = useState<FormMode>('none')
  const [editing, setEditing] = useState<Activity | null>(null)

  // Keep the selection valid when the trip dates change (e.g. after editing
  // the trip) or when the trip itself is replaced.
  useEffect(() => {
    if (days.length > 0 && !days.includes(selectedDay)) {
      setSelectedDay(days[0])
    }
  }, [days, selectedDay])

  const dayActivities = useMemo(
    () => (trip ? trip.activities.filter((activity) => activity.date === selectedDay) : []),
    [trip, selectedDay],
  )

  if (!trip) return null

  function closeForm() {
    setMode('none')
    setEditing(null)
  }

  function handleDaySelect(day: string) {
    setSelectedDay(day)
    closeForm()
  }

  function handleCreate(input: ActivityInput) {
    addActivity(trip!.id, { ...input, date: selectedDay })
    closeForm()
  }

  function handleUpdate(input: ActivityInput) {
    if (!editing) return
    updateActivity(trip!.id, editing.id, { ...input, date: editing.date ?? selectedDay })
    closeForm()
  }

  function handleDelete(activity: Activity) {
    deleteActivity(trip!.id, activity.id)
    if (editing?.id === activity.id) closeForm()
  }

  function handleEdit(activity: Activity) {
    setEditing(activity)
    setMode('edit')
  }

  return (
    <section className="day-plan">
      <DayTabs
        days={days}
        selected={selectedDay}
        onSelect={handleDaySelect}
        label="Reisetag wählen"
      />

      <div
        className="day-plan__content"
        id="day-plan-panel"
        role="tabpanel"
        aria-labelledby={selectedDay ? `day-tab-${selectedDay}` : undefined}
      >
        <div className="day-plan__header">
          <h2 className="day-plan__heading">Tagesplan</h2>
          {mode === 'none' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setEditing(null)
                setMode('create')
              }}
            >
              Aktivität hinzufügen
            </button>
          )}
        </div>

        {mode === 'none' && (
          <ActivityList
            activities={dayActivities}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {mode === 'create' && (
          <ActivityForm onSubmit={handleCreate} onCancel={closeForm} />
        )}

        {mode === 'edit' && editing && (
          <ActivityForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={closeForm}
          />
        )}
      </div>
    </section>
  )
}
