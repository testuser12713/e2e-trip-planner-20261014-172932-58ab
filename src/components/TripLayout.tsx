import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { formatDate } from '../lib/format'
import { useTrips } from '../state/TripContext'
import { NotFoundPage } from '../pages/NotFoundPage'

export function TripLayout() {
  const { id } = useParams<{ id: string }>()
  const { getTrip } = useTrips()
  const trip = id ? getTrip(id) : undefined

  if (!trip) {
    return <NotFoundPage />
  }

  const basePath = `/trips/${trip.id}`

  return (
    <section className="trip-layout">
      <div className="trip-header">
        <div className="trip-header__titles">
          <h1 className="trip-header__title">{trip.destination}</h1>
          <p className="trip-header__dates">
            {formatDate(trip.startDate)} – {formatDate(trip.endDate)}
          </p>
        </div>
        <Link to={`${basePath}/edit`} className="btn btn-secondary">
          Bearbeiten
        </Link>
      </div>

      <nav className="segmented" aria-label="Reise-Navigation">
        <NavLink
          to={basePath}
          end
          className={({ isActive }) =>
            isActive ? 'segmented__item segmented__item--active' : 'segmented__item'
          }
        >
          Tagesplan
        </NavLink>
        <NavLink
          to={`${basePath}/budget`}
          className={({ isActive }) =>
            isActive ? 'segmented__item segmented__item--active' : 'segmented__item'
          }
        >
          Budget
        </NavLink>
        <NavLink
          to={`${basePath}/packing`}
          className={({ isActive }) =>
            isActive ? 'segmented__item segmented__item--active' : 'segmented__item'
          }
        >
          Packliste
        </NavLink>
      </nav>

      <Outlet />
    </section>
  )
}
