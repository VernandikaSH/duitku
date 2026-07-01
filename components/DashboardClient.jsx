'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import TransactionForm from './TransactionForm'

const COLORS = ['#2f9d78', '#3b7fc4', '#f4a261', '#e76f51', '#8ecae6', '#b56576', '#6d597a', '#94a3b8']

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

function PieChartCard({ title, data, emptyText }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="font-semibold text-slate-800 mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-16">{emptyText}</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatRupiah(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
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

  // Agregasi pengeluaran per kategori untuk pie chart
  const expenseByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

  const expenseChartData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }))

  // Agregasi pemasukan per kategori untuk pie chart
  const incomeByCategory = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
      return acc
    }, {})

  const incomeChartData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }))

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Ringkasan Saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-1">Saldo Bulan Ini</p>
          <p className={`text-2xl font-semibold ${balance >= 0 ? 'text-primary-600' : 'text-red-500'}`}>
            {formatRupiah(balance)}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-1">Total Pemasukan</p>
          <p className="text-2xl font-semibold text-accent-500">{formatRupiah(totalIncome)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500 mb-1">Total Pengeluaran</p>
          <p className="text-2xl font-semibold text-red-500">{formatRupiah(totalExpense)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartCard title="Pengeluaran per Kategori" data={expenseChartData} emptyText="Belum ada data pengeluaran bulan ini." />
        <PieChartCard title="Pemasukan per Kategori" data={incomeChartData} emptyText="Belum ada data pemasukan bulan ini." />
      </div>

      {/* Form tambah transaksi / toggle */}
      <div>
        {showForm ? (
          <TransactionForm onSuccess={() => setShowForm(false)} />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl shadow-sm border-2 border-dashed border-slate-200 hover:border-primary-300 transition-colors text-slate-500 hover:text-primary-600 py-6"
          >
            <span className="text-2xl">+</span>
            <span className="text-sm font-medium">Tambah Transaksi Baru</span>
          </button>
        )}
      </div>

      {/* Transaksi terbaru */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-800">Transaksi Terbaru</h3>
          <a href="/transactions" className="text-sm text-primary-600 hover:underline">
            Lihat semua
          </a>
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Belum ada transaksi.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.category}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {t.note ? ` · ${t.note}` : ''}
                  </p>
                </div>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-primary-600' : 'text-red-500'}`}>
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