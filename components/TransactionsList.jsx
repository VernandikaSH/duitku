'use client'

import { useState, useEffect, useCallback } from 'react'
import TransactionForm from './TransactionForm'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories'

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].filter(
  (cat, index, arr) => arr.indexOf(cat) === index // hilangkan duplikat (misal "Lainnya")
)

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)
}

export default function TransactionsList({ initialTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Filter state
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [category, setCategory] = useState('')

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (category) params.set('category', category)

    const res = await fetch(`/api/transactions?${params.toString()}`)
    const result = await res.json()
    setLoading(false)

    if (res.ok) {
      setTransactions(result.data)
    }
  }, [from, to, category])

  // Refetch setiap kali filter berubah
  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return

    setDeletingId(id)
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    setDeletingId(null)

    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } else {
      alert('Gagal menghapus transaksi')
    }
  }

  function resetFilters() {
    setFrom('')
    setTo('')
    setCategory('')
  }

  const editingTransaction = transactions.find((t) => t.id === editingId)

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">Semua Kategori</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Form edit muncul di atas kalau sedang mengedit */}
      {editingTransaction && (
        <TransactionForm
          editData={editingTransaction}
          onCancel={() => setEditingId(null)}
          onSuccess={(updated) => {
            setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
            setEditingId(null)
          }}
        />
      )}

      {/* Daftar transaksi */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-8">Memuat...</p>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">Tidak ada transaksi yang cocok dengan filter.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <li key={t.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700">{t.category}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {t.note ? ` · ${t.note}` : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-primary-600' : 'text-red-500'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                  </span>
                  <button
                    onClick={() => setEditingId(t.id)}
                    className="text-xs text-accent-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="text-xs text-red-400 hover:underline disabled:opacity-50"
                  >
                    {deletingId === t.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}