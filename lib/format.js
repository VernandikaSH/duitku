// Format angka, uang & tanggal dalam satu tempat, supaya tampilannya sama di seluruh aplikasi
import { parseDateLocal } from './date'

const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const numberFmt = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 })

// 1500000 -> "Rp 1.500.000"
export function formatRupiah(num) {
  return rupiahFmt.format(num)
}

// 1500 -> "+Rp 1.500", -1500 -> "-Rp 1.500", 0 -> "Rp 0"
export function formatSigned(num) {
  return `${num > 0 ? '+' : num < 0 ? '-' : ''}${formatRupiah(Math.abs(num))}`
}

const dateShortFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

// "2026-11-03" -> "3 Nov 2026"
export function formatDateShort(date) {
  return dateShortFmt.format(typeof date === 'string' ? parseDateLocal(date) : date)
}

// String angka tanpa pemisah -> dengan pemisah ribuan: "1000000" -> "1.000.000", "" -> ""
export function formatThousands(digits) {
  return digits ? numberFmt.format(Number(digits)) : ''
}
