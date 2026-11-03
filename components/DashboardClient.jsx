'use client'

import { useState } from 'react'
import TextLink from '@/components/ui/TextLink'
import TransactionForm from './TransactionForm'
import TransactionRow from './TransactionRow'
import PageContainer from '@/components/ui/PageContainer'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import EmptyState from '@/components/ui/EmptyState'
import Amount from '@/components/ui/Amount'
import { formatRupiah } from '@/lib/format'

function CategoryBreakdown({ title, data, emptyText, barColor }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const sorted = [...data].sort((a, b) => b.value - a.value)

  return (
    <Card>
      <SectionHeader title={title} className="mb-4" />
      {sorted.length === 0 ? (
        <EmptyState>{emptyText}</EmptyState>
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
    </Card>
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
    <PageContainer className="py-6 sm:py-10 space-y-6">
      {/* Saldo */}
      <Card padding="lg">
        <p className="text-sm text-parchment-dim mb-2">Saldo bulan ini</p>
        <Amount as="p" value={balance} className="text-4xl sm:text-5xl font-serif" />
        <div className="flex gap-8 mt-6 pt-6 border-t border-line">
          <div>
            <p className="text-xs text-parchment-dim mb-1">Pemasukan</p>
            <Amount as="p" value={totalIncome} type="income" className="text-lg" />
          </div>
          <div>
            <p className="text-xs text-parchment-dim mb-1">Pengeluaran</p>
            <Amount as="p" value={totalExpense} type="expense" className="text-lg" />
          </div>
        </div>
      </Card>

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
      <Card>
        <SectionHeader
          title="Transaksi terbaru"
          action={
            <TextLink href="/transactions" className="text-sm">
              Lihat semua
            </TextLink>
          }
          className="mb-4"
        />
        {transactions.length === 0 ? (
          <EmptyState>Belum ada transaksi.</EmptyState>
        ) : (
          <ul className="divide-y divide-line">
            {transactions.slice(0, 5).map((t) => (
              <TransactionRow key={t.id} transaction={t} />
            ))}
          </ul>
        )}
      </Card>
    </PageContainer>
  )
}
