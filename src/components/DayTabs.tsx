import { formatDate } from '../lib/format'

export interface DayTabsProps {
  days: string[]
  selected: string
  onSelect: (day: string) => void
  label: string
}

const weekdayFormatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  timeZone: 'UTC',
})

function dayLabel(day: string, index: number): string {
  const date = new Date(`${day}T00:00:00Z`)
  const weekday = Number.isNaN(date.getTime())
    ? ''
    : weekdayFormatter.format(date).replace('.', '')
  const datePart = `${weekday ? `${weekday}, ` : ''}${formatDate(day)}`
  return `Tag ${index + 1} · ${datePart}`
}

export function DayTabs({ days, selected, onSelect, label }: DayTabsProps) {
  if (days.length === 0) return null

  return (
    <div
      className="segmented day-tabs"
      role="tablist"
      aria-label={label}
    >
      {days.map((day, index) => {
        const isSelected = day === selected
        return (
          <button
            key={day}
            type="button"
            role="tab"
            id={`day-tab-${day}`}
            aria-selected={isSelected}
            aria-controls="day-plan-panel"
            className={
              isSelected
                ? 'segmented__item segmented__item--active'
                : 'segmented__item'
            }
            onClick={() => onSelect(day)}
          >
            {dayLabel(day, index)}
          </button>
        )
      })}
    </div>
  )
}
