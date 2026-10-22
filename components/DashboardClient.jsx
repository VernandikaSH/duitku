'use client'

import { useState } from 'react'
import Link from 'next/link'
import TransactionForm from './TransactionForm'

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

function CategoryBreakdown({ title, data, emptyText, barColor }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const sorted = [...data].sort((a, b) => b.value - a.value)

  return (
    <div className="bg-panel border border-brass/15 rounded-lg p-6">
      <h3 className="text-sm text-parchment-dim mb-4">{title}</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-parchment-dim/60 text-center py-12">{emptyText}</p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((d) => (
            <li key={d.name}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-parchment">{d.name}</span>
                <span className="text-sm text-parchment-dim">{formatRupiah(d.value)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-charcoal2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${total ? (d.value / total) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function DashboardClient({ transactions }) {
  const [showForm, setShowForm] = useState(false)

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpense

  // Agregasi pengeluaran per kategori
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))

  // Agregasi pemasukan per kategori
  const incomeByCategory = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

  const incomeChartData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Saldo */}
      <div className="bg-panel border border-brass/15 rounded-lg p-8">
        <p className="text-sm text-parchment-dim mb-2">Saldo bulan ini</p>
        <p className={`text-4xl sm:text-5xl font-serif ${balance >= 0 ? 'text-brass-soft' : 'text-loss'}`}>
          {formatRupiah(balance)}
        </p>
        <div className="flex gap-8 mt-6 pt-6 border-t border-brass/15">
          <div>
            <p className="text-xs text-parchment-dim mb-1">Pemasukan</p>
            <p className="text-lg text-brass-soft">{formatRupiah(totalIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-parchment-dim mb-1">Pengeluaran</p>
            <p className="text-lg text-loss">{formatRupiah(totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown
          title="Pengeluaran per kategori"
          data={expenseChartData}
          emptyText="Belum ada data pengeluaran bulan ini."
          barColor="bg-loss"
        />
        <CategoryBreakdown
          title="Pemasukan per kategori"
          data={incomeChartData}
          emptyText="Belum ada data pemasukan bulan ini."
          barColor="bg-brass"
        />
      </div>

      {/* Form tambah transaksi / toggle */}
      <div>
        {showForm ? (
          <TransactionForm autoFocusAmount onSuccess={() => setShowForm(false)} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-panel/40 rounded-lg border border-dashed border-brass/25 hover:border-brass/50 transition-colors text-parchment-dim hover:text-brass-soft py-6"
          >
            <span className="text-xl">+</span>
            <span className="text-sm">Tambah Transaksi Baru</span>
          </button>
        )}
      </div>

      {/* Transaksi terbaru */}
      <div className="bg-panel border border-brass/15 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm text-parchment-dim">Transaksi terbaru</h3>
          <Link href="/transactions" className="text-sm text-brass-soft hover:underline">
            Lihat semua
          </Link>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-parchment-dim/60 text-center py-8">Belum ada transaksi.</p>
        ) : (
          <ul>
            {transactions.slice(0, 5).map((t, i) => (
              <li
                key={t.id}
                className={`flex justify-between items-center py-3 ${
                  i < transactions.slice(0, 5).length - 1 ? 'border-b border-brass/10' : ''
                }`}
              >
                <div>
                  <p className="text-sm text-parchment">{t.category}</p>
                  <p className="text-xs text-parchment-dim">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {t.note ? ` · ${t.note}` : ''}
                  </p>
                </div>
                <span className={`text-sm ${t.type === 'income' ? 'text-brass-soft' : 'text-loss'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
