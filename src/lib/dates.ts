const ISO_DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const MS_PER_DAY = 86_400_000

// Parse an ISO `YYYY-MM-DD` day to a UTC timestamp at midnight. Using UTC
// (instead of local time) keeps the iteration stable across DST changes.
function toUtcMidnight(iso: string): number | null {
  const match = ISO_DAY_PATTERN.exec(iso)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const timestamp = Date.UTC(year, month - 1, day)
  const date = new Date(timestamp)
  // Reject dates the calendar normalised away, e.g. 2025-02-30.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return timestamp
}

function formatUtcMidnight(timestamp: number): string {
  const date = new Date(timestamp)
  const year = String(date.getUTCFullYear()).padStart(4, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Every calendar day of the period as ISO `YYYY-MM-DD`, both ends included.
 * Returns an empty list when either date is invalid or the end lies before
 * the start, so callers never build a bogus range.
 */
export function deriveTripDays(startDate: string, endDate: string): string[] {
  const start = toUtcMidnight(startDate)
  const end = toUtcMidnight(endDate)
  if (start === null || end === null || end < start) return []

  const days: string[] = []
  for (let timestamp = start; timestamp <= end; timestamp += MS_PER_DAY) {
    days.push(formatUtcMidnight(timestamp))
  }
  return days
}
