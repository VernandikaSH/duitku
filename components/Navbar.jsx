'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function Navbar({ active, email }) {
  return (
    <nav className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          <h1 className="text-lg font-semibold text-primary-600 shrink-0">Duitku</h1>
          <div className="flex items-center gap-3 sm:gap-4 text-sm">
            <Link
              href="/dashboard"
              className={active === 'dashboard' ? 'text-primary-600 font-medium' : 'text-slate-500 hover:text-primary-600'}
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={active === 'transactions' ? 'text-primary-600 font-medium' : 'text-slate-500 hover:text-primary-600'}
            >
              Riwayat
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Email disembunyikan di layar kecil supaya navbar tidak sesak */}
          <span className="hidden sm:inline text-sm text-slate-500 truncate max-w-[160px]">
            {email}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}