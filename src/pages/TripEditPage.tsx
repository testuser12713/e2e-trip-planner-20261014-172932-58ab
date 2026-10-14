import { useNavigate, useParams } from 'react-router-dom'
import { TripForm } from '../components/TripForm'
import { useTrips } from '../state/TripContext'
import { NotFoundPage } from './NotFoundPage'
import type { TripInput } from '../types'

export function TripEditPage() {
  const { id } = useParams<{ id: string }>()
  const { getTrip, updateTrip } = useTrips()
  const navigate = useNavigate()
  const trip = id ? getTrip(id) : undefined

  if (!trip) {
    return <NotFoundPage />
  }

  const tripId = trip.id

  function handleSubmit(input: TripInput) {
    updateTrip(tripId, input)
    navigate(`/trips/${tripId}`)
  }

  return (
    <section className="trip-edit">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Reise bearbeiten</h1>
          <p className="page-header__subtitle">{trip.destination}</p>
        </div>
      </div>

      <div className="card trip-edit__card">
        <TripForm
          initialValues={{
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
          }}
          submitLabel="Änderungen speichern"
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/trips/${tripId}`)}
        />
      </div>
    </section>
  )
}
