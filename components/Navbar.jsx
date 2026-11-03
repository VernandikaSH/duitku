'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import LogoutButton from './LogoutButton'
import Logo from '@/components/ui/Logo'

const TABS = [
  { key: 'dashboard', href: '/dashboard', label: 'Dashboard' },
  { key: 'transactions', href: '/transactions', label: 'Riwayat' },
  { key: 'cashflow', href: '/cashflow', label: 'Cashflow' },
]

export default function Navbar({ active, email }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [target, setTarget] = useState(null)

  // Tab yang diklik langsung tampil aktif selagi halaman tujuan dimuat
  const current = isPending && target ? target : active

  function handleClick(e, tab) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (tab.key === current) return
    setTarget(tab.key)
    startTransition(() => router.push(tab.href))
  }

  return (
    <nav className="bg-panel border-b border-line px-4 sm:px-6 py-4">
      {/* Di layar kecil tab turun ke baris kedua agar tidak menabrak tombol Keluar */}
      <div className="max-w-4xl mx-auto flex flex-wrap items-center gap-x-8 gap-y-3">
        <Logo as="h1" className="order-1 shrink-0" />

        <div className="order-3 sm:order-2 w-full sm:w-auto flex items-center gap-6 text-sm whitespace-nowrap overflow-x-auto">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              onClick={(e) => handleClick(e, tab)}
              className={`border-b pb-0.5 transition-colors ${
                current === tab.key
                  ? 'text-brass-soft border-brass'
                  : 'text-parchment-dim border-transparent hover:text-parchment'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="order-2 sm:order-3 ml-auto flex items-center gap-4 shrink-0">
          <span className="hidden sm:inline text-sm text-parchment-dim truncate max-w-[160px]">
            {email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
