export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

// Format a Date as YYYY-MM-DD using its local calendar fields.
// Never use `date.toISOString().split('T')[0]` for this: toISOString()
// converts to UTC first, which silently shifts the date back a day for any
// positive-offset timezone (WIB/WITA/WIT included) near midnight.
export function formatDateLocal(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
