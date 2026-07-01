'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCategoriesByType } from '@/lib/categories'

export default function TransactionForm({ onSuccess, onCancel, editData }) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">
          {isEditMode ? 'Edit Transaksi' : 'Tambah Transaksi'}
        </h3>
        {isEditMode && onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-slate-400 hover:text-slate-600">
            Batal
          </button>
        )}
      </div>

      {/* Toggle income/expense */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('expense')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            type === 'expense'
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-slate-50 text-slate-500 border border-transparent'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('income')}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            type === 'income'
              ? 'bg-primary-50 text-primary-600 border border-primary-100'
              : 'bg-slate-50 text-slate-500 border border-transparent'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah (Rp)</label>
        <input
          type="number"
          required
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="50000"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            {getCategoriesByType(type).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Catatan <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Misal: makan siang bareng tim"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
      >
        {loading ? 'Menyimpan...' : isEditMode ? 'Update Transaksi' : 'Simpan Transaksi'}
      </button>
    </form>
  )
}