'use client'

import { useEffect, useRef, useState } from 'react'
import TextLink from '@/components/ui/TextLink'
import { MONTH_NAMES } from '@/lib/date'

const SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// Judul bulan yang bisa diklik untuk membuka popup pilih bulan (tahun + grid 12 bulan)
export default function MonthPicker({ year, month, onSelect, children }) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(year) // tahun yang sedang ditampilkan di popup
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth() + 1

  function openPicker() {
    setViewYear(year)
    setOpen(true)
  }

  function close(returnFocus) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  function pick(y, m) {
    close(true)
    if (y !== year || m !== month) onSelect(y, m)
  }

  useEffect(() => {
    if (!open) return

    // Fokus ke bulan yang sedang dipilih supaya bisa langsung dipakai dengan keyboard
    const selected = panelRef.current?.querySelector('[aria-pressed="true"]')
    ;(selected || panelRef.current?.querySelector('button'))?.focus()

    function onPointerDown(e) {
      if (!rootRef.current?.contains(e.target)) close(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') close(true)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <span ref={rootRef} className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? close(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md hover:text-brass-soft transition-colors"
      >
        {children}
        <span
          aria-hidden="true"
          className={`text-xs not-italic text-parchment-dim transition-transform ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {open && (
        // Wrapper untuk posisi (translate), panel di dalamnya untuk animasi (transform)
        <div className="absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2">
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Pilih bulan"
            className="picker-enter w-64 rounded-lg border border-line bg-charcoal2 p-3 shadow-xl shadow-black/40 font-sans not-italic text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <TextLink
                variant="muted"
                onClick={() => setViewYear((y) => y - 1)}
                aria-label="Tahun sebelumnya"
                className="px-2 py-1 text-base"
              >
                ‹
              </TextLink>
              <span className="text-sm text-parchment">{viewYear}</span>
              <TextLink
                variant="muted"
                onClick={() => setViewYear((y) => y + 1)}
                aria-label="Tahun berikutnya"
                className="px-2 py-1 text-base"
              >
                ›
              </TextLink>
            </div>

            <div className="grid grid-cols-3 gap-1">
              {SHORT_NAMES.map((name, i) => {
                const m = i + 1
                const isSelected = viewYear === year && m === month
                const isThisMonth = viewYear === thisYear && m === thisMonth
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => pick(viewYear, m)}
                    aria-pressed={isSelected}
                    aria-label={`${MONTH_NAMES[i]} ${viewYear}`}
                    className={`rounded-md py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-brass text-charcoal font-medium'
                        : isThisMonth
                          ? 'text-brass-soft ring-1 ring-inset ring-brass/30 hover:bg-panel'
                          : 'text-parchment-dim hover:bg-panel hover:text-parchment'
                    }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>

            {!(year === thisYear && month === thisMonth) && (
              <div className="mt-3 pt-3 border-t border-line text-center">
                <TextLink onClick={() => pick(thisYear, thisMonth)} className="text-xs">
                  Ke Bulan Ini
                </TextLink>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  )
}
