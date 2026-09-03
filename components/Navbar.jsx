'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Navbar({ active, email }) {
  return (
    <nav className="bg-panel border-b border-brass/15 px-4 sm:px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-6 sm:gap-8 min-w-0">
          <h1 className="text-lg font-serif italic text-brass-soft shrink-0">Duitku</h1>
          <div className="flex items-center gap-4 sm:gap-6 text-sm">
            <Link
              href="/dashboard"
              className={
                active === 'dashboard'
                  ? 'text-brass-soft border-b border-brass pb-0.5'
                  : 'text-parchment-dim hover:text-parchment transition-colors'
              }
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={
                active === 'transactions'
                  ? 'text-brass-soft border-b border-brass pb-0.5'
                  : 'text-parchment-dim hover:text-parchment transition-colors'
              }
            >
              Riwayat
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden sm:inline text-sm text-parchment-dim truncate max-w-[160px]">
            {email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
