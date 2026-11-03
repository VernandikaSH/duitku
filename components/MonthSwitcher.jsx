'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import MonthNav from './MonthNav'
import PageContainer from '@/components/ui/PageContainer'
import { formatMonthParam } from '@/lib/date'

export default function MonthSwitcher({ year, month, children }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [target, setTarget] = useState(null)   // bulan tujuan (optimistik)
  const [direction, setDirection] = useState(0) // -1 = mundur, 1 = maju

  // Arah dihitung dari perubahan bulan, jadi tetap benar juga untuk
  // tombol Back/Forward browser (bukan hanya klik di MonthNav)
  const ym = year * 12 + month
  const [prevYm, setPrevYm] = useState(ym)
  if (ym !== prevYm) {
    setPrevYm(ym)
    setDirection(Math.sign(ym - prevYm))
  }

  // Selama data bulan baru dimuat, label langsung menampilkan bulan tujuan
  const shown = isPending && target ? target : { year, month }

  function goTo(next) {
    setTarget(next)
    startTransition(() => {
      router.push(`/dashboard?month=${formatMonthParam(next.year, next.month)}`, { scroll: false })
    })
  }

  // Tombol Bulan Lalu / Bulan Depan
  function navigate(delta) {
    const d = new Date(shown.year, shown.month - 1 + delta, 1)
    goTo({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  const enterClass =
    direction > 0 ? 'month-enter-next' : direction < 0 ? 'month-enter-prev' : ''

  return (
    <>
      <PageContainer className="pt-6 sm:pt-8">
        <MonthNav
          year={shown.year}
          month={shown.month}
          onNavigate={navigate}
          onSelect={(year, month) => goTo({ year, month })}
        />
      </PageContainer>

      <div className="pending-fade" data-pending={isPending}>
        {/* key berganti -> subtree remount -> animasi masuk diputar ulang */}
        <div key={`${year}-${month}`} className={enterClass}>
          {children}
        </div>
      </div>
    </>
  )
}
