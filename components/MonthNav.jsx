'use client'

import TextLink from '@/components/ui/TextLink'
import MonthPicker from './MonthPicker'
import Card from '@/components/ui/Card'
import { MONTH_NAMES, formatMonthParam } from '@/lib/date'
import { isPlainLeftClick } from '@/lib/navigation'

// Klik kiri biasa ditangani lewat transisi; klik tengah / Ctrl+klik tetap
// berperilaku seperti link normal (buka tab baru, dst.)
function handleClick(e, onNavigate, delta) {
  if (!onNavigate || !isPlainLeftClick(e)) return
  e.preventDefault()
  onNavigate(delta)
}

export default function MonthNav({ year, month, onNavigate, onSelect }) {
  // Hitung bulan sebelumnya & berikutnya (menangani pergantian tahun)
  const prevDate = new Date(year, month - 2, 1) // month - 1 (0-index) - 1 (mundur)
  const nextDate = new Date(year, month, 1)     // month (0-index) sudah maju satu

  const prevParam = formatMonthParam(prevDate.getFullYear(), prevDate.getMonth() + 1)
  const nextParam = formatMonthParam(nextDate.getFullYear(), nextDate.getMonth() + 1)

  const now = new Date()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  return (
    <Card padding="none" className="flex items-center justify-between px-3 sm:px-5 py-3 gap-2">
      <TextLink
        href={`/dashboard?month=${prevParam}`}
        onClick={(e) => handleClick(e, onNavigate, -1)}
        variant="muted"
        className="text-xs sm:text-sm px-1.5 sm:px-2 py-1 whitespace-nowrap"
      >
        <span className="sm:hidden">‹ Lalu</span>
        <span className="hidden sm:inline">← Bulan Lalu</span>
      </TextLink>

      <span className="text-sm font-serif italic text-parchment text-center">
        {onSelect ? (
          <MonthPicker year={year} month={month} onSelect={onSelect}>
            {MONTH_NAMES[month - 1]} {year}
          </MonthPicker>
        ) : (
          <>{MONTH_NAMES[month - 1]} {year}</>
        )}
        {isCurrentMonth && (
          <span className="block sm:inline sm:ml-2 text-xs font-sans not-italic text-brass-soft border border-brass/30 px-2 py-0.5 rounded-full mt-1 sm:mt-0">
            Bulan Ini
          </span>
        )}
      </span>

      <TextLink
        href={`/dashboard?month=${nextParam}`}
        onClick={(e) => handleClick(e, onNavigate, 1)}
        variant="muted"
        className="text-xs sm:text-sm px-1.5 sm:px-2 py-1 whitespace-nowrap"
      >
        <span className="sm:hidden">Depan ›</span>
        <span className="hidden sm:inline">Bulan Depan →</span>
      </TextLink>
    </Card>
  )
}
