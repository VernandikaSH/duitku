'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCategoriesByType } from '@/lib/categories'
import { formatDateLocal } from '@/lib/date'
import Button from '@/components/ui/Button'
import TextLink from '@/components/ui/TextLink'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import Alert from '@/components/ui/Alert'
import MoneyInput from '@/components/ui/MoneyInput'

export default function TransactionForm({ onSuccess, onCancel, editData, autoFocusAmount = false }) {
  const router = useRouter()
  const today = formatDateLocal(new Date())
  const isEditMode = Boolean(editData)

  const [type, setType] = useState(editData?.type || 'expense')
  const [amount, setAmount] = useState(
    // Simpan sebagai string angka mentah (tanpa titik); titik ribuan hanya untuk tampilan
    editData ? String(Math.round(Number(editData.amount))) : ''
  )
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
    <Card onSubmit={handleSubmit} as="form" className="space-y-4">
      <SectionHeader
        title={isEditMode ? 'Edit transaksi' : 'Tambah transaksi'}
        action={
          isEditMode &&
          onCancel && (
            <TextLink onClick={onCancel} variant="muted" className="text-sm">
              Batal
            </TextLink>
          )
        }
      />

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

      <MoneyInput
        label="Jumlah (Rp)"
        required
        autoFocus={autoFocusAmount}
        value={amount}
        onValueChange={setAmount}
        placeholder="50.000"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Kategori"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {getCategoriesByType(type).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>

        <Input
          label="Tanggal"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <Input
        label="Catatan"
        optional
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Misal: makan siang bareng tim"
      />

      {error && (
        <Alert>{error}</Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full py-2.5"
      >
        {loading ? 'Menyimpan...' : isEditMode ? 'Update Transaksi' : 'Simpan Transaksi'}
      </Button>
    </Card>
  )
}
