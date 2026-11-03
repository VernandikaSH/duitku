'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import TransactionForm from './TransactionForm'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/categories'
import Button from '@/components/ui/Button'
import TextLink from '@/components/ui/TextLink'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Alert from '@/components/ui/Alert'
import Amount from '@/components/ui/Amount'

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].filter(
  (cat, index, arr) => arr.indexOf(cat) === index // hilangkan duplikat (misal "Lainnya")
)

const PAGE_SIZE = 25

export default function TransactionsList({ initialTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [page, setPage] = useState(1)

  // Filter state
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [category, setCategory] = useState('')

  // Kalau daftar mengecil (misal setelah hapus) dan halaman saat ini jadi
  // kosong, mundur ke halaman terakhir yang masih punya data
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const pageStart = (page - 1) * PAGE_SIZE
  const visibleTransactions = transactions.slice(pageStart, pageStart + PAGE_SIZE)

  // Refetch setiap kali filter berubah. Data awal sudah dikirim server, jadi
  // kombinasi filter kosong saat pertama dibuka tidak perlu diambil ulang.
  const lastFilterKey = useRef('||')
  useEffect(() => {
    const key = `${from}|${to}|${category}`
    if (key === lastFilterKey.current) return
    lastFilterKey.current = key

    const controller = new AbortController()
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    if (category) params.set('category', category)

    setLoading(true)
    fetch(`/api/transactions?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const result = await res.json()
        if (res.ok) {
          setTransactions(result.data)
          setPage(1) // filter berubah -> mulai lagi dari halaman pertama
        }
        setLoading(false)
      })
      .catch((err) => {
        // Request lama dibatalkan karena filter berubah lagi -> abaikan
        if (err.name !== 'AbortError') setLoading(false)
      })

    return () => controller.abort()
  }, [from, to, category])

  // Batalkan konfirmasi hapus dengan tombol Escape
  useEffect(() => {
    if (!pendingDelete) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setPendingDelete(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pendingDelete])

  // Tutup popup edit dengan tombol Escape
  useEffect(() => {
    if (!editingId) return
    function onKeyDown(e) {
      if (e.key === 'Escape') setEditingId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [editingId])

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    setDeleteError('')

    const res = await fetch(`/api/transactions/${pendingDelete.id}`, { method: 'DELETE' })
    setDeleting(false)

    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t.id !== pendingDelete.id))
      setPendingDelete(null)
    } else {
      setDeleteError('Gagal menghapus transaksi. Coba lagi.')
    }
  }

  function resetFilters() {
    setFrom('')
    setTo('')
    setCategory('')
  }

  const editingTransaction = transactions.find((t) => t.id === editingId)

  // Pindah halaman lalu bawa layar ke posisi yang nyambung dengan arah navigasi:
  // "Berikutnya" ke transaksi paling atas, "Sebelumnya" ke transaksi paling bawah
  const listRef = useRef(null)
  const scrollTarget = useRef(null)
  function goToPage(nextPage, target) {
    scrollTarget.current = target
    setPage(nextPage)
  }

  // Scroll setelah halaman baru dirender, supaya posisi akhir daftar sudah sesuai isi halaman baru
  useEffect(() => {
    const target = scrollTarget.current
    if (!target) return
    scrollTarget.current = null
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    listRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: target })
  }, [page])

  // Navigasi halaman, dipakai di atas dan di bawah daftar supaya tidak perlu scroll jauh
  function renderPagination(spacingClass) {
    if (transactions.length === 0 || totalPages <= 1) return null
    return (
      <div className={`flex items-center justify-between border-line ${spacingClass}`}>
        <span className="text-xs text-parchment-dim">
          {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, transactions.length)} dari {transactions.length} transaksi
        </span>
        <div className="flex items-center gap-3">
          <TextLink
            onClick={() => goToPage(Math.max(1, page - 1), 'end')}
            disabled={page === 1}
            variant="muted"
            className="text-xs"
          >
            Sebelumnya
          </TextLink>
          <span className="text-xs text-parchment-dim">
            {page} / {totalPages}
          </span>
          <TextLink
            onClick={() => goToPage(Math.min(totalPages, page + 1), 'start')}
            disabled={page === totalPages}
            variant="muted"
            className="text-xs"
          >
            Berikutnya
          </TextLink>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Input
            label="Dari Tanggal"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            label="Sampai Tanggal"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Select
            label="Kategori"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <div>
            <span className="hidden sm:block text-sm mb-1 invisible" aria-hidden="true">Reset</span>
            <Button
              onClick={resetFilters}
              variant="secondary"
              className="w-full h-10 px-3"
            >
              Reset Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Daftar transaksi */}
      {/* Saat filter dimuat, daftar lama tetap tampil tapi meredup */}
      <Card
        ref={listRef}
        className="pending-fade scroll-my-4"
        data-pending={loading}
        aria-busy={loading}
      >
        {renderPagination('mb-4 pb-4 border-b')}

        {transactions.length === 0 ? (
          <EmptyState>Tidak ada transaksi yang cocok dengan filter.</EmptyState>
        ) : (
          <ul>
            {visibleTransactions.map((t, i) => (
              <li
                key={t.id}
                className={`flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 gap-2 ${
                  i < visibleTransactions.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm text-parchment">{t.category}</p>
                  <p className="text-xs text-parchment-dim truncate">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {t.note ? ` · ${t.note}` : ''}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <Amount value={t.amount} type={t.type} signed className="text-sm" />
                  <TextLink
                    onClick={() => setEditingId(t.id)}
                    className="text-xs"
                  >
                    Edit
                  </TextLink>
                  <TextLink
                    onClick={() => {
                      setDeleteError('')
                      setPendingDelete(t)
                    }}
                    variant="danger"
                    className="text-xs"
                  >
                    Hapus
                  </TextLink>
                </div>
              </li>
            ))}
          </ul>
        )}

        {renderPagination('mt-4 pt-4 border-t')}
      </Card>

      {/* Popup dirender ke body lewat portal: wrapper halaman (.page-enter) punya animasi transform,
          yang membuat position: fixed di dalamnya relatif ke halaman, bukan ke layar */}
      {/* Popup edit transaksi */}
      {editingTransaction && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm px-4 py-6"
          onClick={() => setEditingId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit transaksi"
            className="w-full max-w-lg max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <TransactionForm
              key={editingTransaction.id}
              editData={editingTransaction}
              onCancel={() => setEditingId(null)}
              onSuccess={(updated) => {
                setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
                setEditingId(null)
              }}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Konfirmasi hapus */}
      {pendingDelete && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm px-4"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <Card
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="delete-dialog-title" className="text-sm text-parchment mb-1">
              Hapus transaksi ini?
            </h3>
            <p className="text-sm text-parchment-dim mb-6">
              {pendingDelete.category} ·{' '}
              <Amount value={pendingDelete.amount} type={pendingDelete.type} signed />{' '}
              pada {new Date(pendingDelete.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}.
              Tindakan ini tidak bisa dibatalkan.
            </p>

            {deleteError && (
              <Alert className="mb-4">{deleteError}</Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                variant="secondary"
                className="px-4 py-2"
              >
                Batal
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={deleting}
                variant="danger"
                className="px-4 py-2"
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  )
}
