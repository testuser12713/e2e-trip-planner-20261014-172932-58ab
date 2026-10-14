import { CATEGORIES } from '../types'
import type { Activity, Category } from '../types'

export interface BudgetSummary {
  total: number
  byCategory: Record<Category, number>
}

/**
 * Aggregates a trip's activities into a grand total and a sum per category.
 * Every category of CATEGORIES is present in the result, unused ones set to 0.
 */
export function aggregateBudget(activities: Activity[]): BudgetSummary {
  const byCategory = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0]),
  ) as Record<Category, number>

  let total = 0
  for (const activity of activities) {
    const cost = Number.isFinite(activity.cost) ? activity.cost : 0
    byCategory[activity.category] += cost
    total += cost
  }

  return { total, byCategory }
}
