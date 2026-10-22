'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCategoriesByType } from '@/lib/categories'
import { formatDateLocal } from '@/lib/date'

export default function TransactionForm({ onSuccess, onCancel, editData, autoFocusAmount = false }) {
  const router = useRouter()
  const today = formatDateLocal(new Date())
  const isEditMode = Boolean(editData)

  const [type, setType] = useState(editData?.type || 'expense')
  const [amount, setAmount] = useState(editData?.amount?.toString() || '')
  const [category, setCategory] = useState(editData?.category || getCategoriesByType('expense')[0])
  const [date, setDate] = useState(editData?.date || today)
  const [note, setNote] = useState(editData?.note || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleTypeChange(newType) {
    setType(newType)
    // Reset kategori ke pilihan pertama saat tipe berubah (income/expense)
    setCategory(getCategoriesByType(newType)[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = isEditMode ? `/api/transactions/${editData.id}` : '/api/transactions'
    const method = isEditMode ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, type, category, note, date }),
    })

    const result = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(result.error || 'Gagal menyimpan transaksi')
      return
    }

    if (!isEditMode) {
      // Reset form hanya untuk mode tambah baru
      setAmount('')
      setNote('')
      setDate(today)
    }

    router.refresh()
    if (onSuccess) onSuccess(result.data)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-panel border border-brass/15 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm text-parchment-dim">
          {isEditMode ? 'Edit transaksi' : 'Tambah transaksi'}
        </h3>
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-parchment-dim hover:text-parchment">
            Batal
          </button>
        )}
      </div>

      {/* Toggle income/expense */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 py-2 rounded-md text-sm transition-colors border ${
            type === 'expense'
              ? 'bg-loss/10 text-loss border-loss/30'
              : 'bg-charcoal2 text-parchment-dim border-transparent'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 py-2 rounded-md text-sm transition-colors border ${
            type === 'income'
              ? 'bg-brass/10 text-brass-soft border-brass/30'
              : 'bg-charcoal2 text-parchment-dim border-transparent'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div>
        <label className="block text-sm text-parchment-dim mb-1">Jumlah (Rp)</label>
        <input
          type="number"
          required
          min="0"
          step="1"
          autoFocus={autoFocusAmount}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50000"
          className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-parchment-dim mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-brass"
          >
            {getCategoriesByType(type).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-parchment-dim mb-1">Tanggal</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-brass"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-parchment-dim mb-1">
          Catatan <span className="text-parchment-dim/60">(opsional)</span>
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Misal: makan siang bareng tim"
          className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass"
        />
      </div>

      {error && (
        <p className="text-sm text-loss bg-loss/10 border border-loss/20 rounded-md px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brass hover:bg-brass-soft text-charcoal font-medium rounded-md py-2.5 text-sm transition-colors disabled:opacity-60"
      >
        {loading ? 'Menyimpan...' : isEditMode ? 'Update Transaksi' : 'Simpan Transaksi'}
      </button>
    </form>
  )
}
