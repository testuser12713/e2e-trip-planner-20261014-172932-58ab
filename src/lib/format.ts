const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

export function formatDate(iso: string): string {
  const match = DATE_PATTERN.exec(iso)
  if (!match) return iso
  const [, year, month, day] = match
  return `${day}.${month}.${year}`
}

export function formatMoney(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0
  return euroFormatter.format(value)
}
