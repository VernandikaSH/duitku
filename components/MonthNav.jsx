'use client'

import Link from 'next/link'

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function formatMonthParam(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

export default function MonthNav({ year, month }) {
  // Hitung bulan sebelumnya & berikutnya (menangani pergantian tahun)
  const prevDate = new Date(year, month - 2, 1) // month - 1 (0-index) - 1 (mundur)
  const nextDate = new Date(year, month, 1)     // month (0-index) sudah maju satu

  const prevParam = formatMonthParam(prevDate.getFullYear(), prevDate.getMonth() + 1)
  const nextParam = formatMonthParam(nextDate.getFullYear(), nextDate.getMonth() + 1)

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm px-3 sm:px-5 py-3 gap-2">
      <Link
        href={`/dashboard?month=${prevParam}`}
        className="text-xs sm:text-sm text-slate-500 hover:text-primary-600 px-1.5 sm:px-2 py-1 whitespace-nowrap"
      >
        <span className="sm:hidden">‹ Lalu</span>
        <span className="hidden sm:inline">← Bulan Lalu</span>
      </Link>

      <span className="text-sm font-semibold text-slate-700 text-center">
        {MONTH_NAMES[month - 1]} {year}
        {isCurrentMonth && (
          <span className="block sm:inline sm:ml-2 text-xs font-normal text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
            Bulan Ini
          </span>
        )}
      </span>

      <Link
        href={`/dashboard?month=${nextParam}`}
        className="text-xs sm:text-sm text-slate-500 hover:text-primary-600 px-1.5 sm:px-2 py-1 whitespace-nowrap"
      >
        <span className="sm:hidden">Depan ›</span>
        <span className="hidden sm:inline">Bulan Depan →</span>
      </Link>
    </div>
  )
}