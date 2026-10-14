import { useParams } from 'react-router-dom'
import { BudgetChart } from '../components/BudgetChart'
import { aggregateBudget } from '../lib/budget'
import { useTrips } from '../state/TripContext'

export function BudgetPage() {
  const { id } = useParams<{ id: string }>()
  const { getTrip } = useTrips()
  const trip = id ? getTrip(id) : undefined

  // An unknown trip id is owned by TripLayout, which renders NotFoundPage.
  if (!trip) {
    return null
  }

  const { total, byCategory } = aggregateBudget(trip.activities)

  return (
    <section className="budget-page" aria-labelledby="budget-heading">
      <div className="card">
        <h2 id="budget-heading" className="budget-page__heading">
          Budgetübersicht
        </h2>
        <BudgetChart total={total} byCategory={byCategory} />
      </div>
    </section>
  )
}
