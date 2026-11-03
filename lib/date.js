export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// (2026, 3) -> "2026-03", format bulan di URL (?month=) dan kunci data per bulan
export function formatMonthParam(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

// "2026-11-03" -> Date di zona waktu lokal.
// new Date("2026-11-03") dibaca sebagai tengah malam UTC, yang bisa bergeser
// sehari di zona waktu negatif; di sini tanggal dibaca apa adanya.
export function parseDateLocal(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(str ?? '')
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(str)
}

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
