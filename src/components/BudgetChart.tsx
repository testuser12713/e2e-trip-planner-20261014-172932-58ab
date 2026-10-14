import { CATEGORIES } from '../types'
import type { Category } from '../types'
import { formatMoney } from '../lib/format'
import type { BudgetSummary } from '../lib/budget'
import './BudgetChart.css'

const CATEGORY_COLOR: Record<Category, string> = {
  Anreise: 'var(--color-cat_anreise)',
  Unterkunft: 'var(--color-cat_unterkunft)',
  Verpflegung: 'var(--color-cat_verpflegung)',
  'Aktivität': 'var(--color-cat_aktivitaet)',
  Shopping: 'var(--color-cat_shopping)',
  Sonstiges: 'var(--color-cat_sonstiges)',
}

export type BudgetChartProps = BudgetSummary

export function BudgetChart({ total, byCategory }: BudgetChartProps) {
  const max = Math.max(0, ...CATEGORIES.map((category) => byCategory[category] ?? 0))

  return (
    <div className="budget-chart">
      <div className="budget-chart__total">
        <span className="budget-chart__total-label">Gesamtsumme</span>
        <span className="budget-chart__total-value">{formatMoney(total)}</span>
      </div>

      <div className="budget-chart__rows">
        {CATEGORIES.map((category) => {
          const value = byCategory[category] ?? 0
          const accessibleLabel = `${category}: ${formatMoney(value)}`
          const width = max > 0 ? (value / max) * 100 : 0

          return (
            <div
              key={category}
              className="budget-chart__row"
              role="group"
              aria-label={accessibleLabel}
            >
              <span className="budget-chart__label">{category}</span>
              <div className="budget-chart__track" role="img" aria-label={accessibleLabel}>
                {value > 0 ? (
                  <span
                    className="budget-chart__bar"
                    style={{ width: `${width}%`, background: CATEGORY_COLOR[category] }}
                  />
                ) : (
                  <span className="budget-chart__hairline" />
                )}
              </div>
              <span className="budget-chart__value">{formatMoney(value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
