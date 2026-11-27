// Helper untuk API routes (server)
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Pastikan request berasal dari user yang login.
//   const { supabase, user, response } = await requireUser()
//   if (response) return response   // 401 kalau belum login
export async function requireUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { supabase, user }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Cek string YYYY-MM-DD yang benar-benar ada di kalender
export function isValidDate(date) {
  if (typeof date !== 'string' || !DATE_RE.test(date)) return false
  const d = new Date(date + 'T00:00:00Z')
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === date
}

// Error dari database: catat detailnya di log, kirim pesan umum ke user
export function serverError(error) {
  console.error(error)
  return NextResponse.json({ error: 'Terjadi kesalahan' }, { status: 500 })
}

// Validasi data transaksi dari body request. Dipakai oleh POST (tambah) dan PUT (edit)
// supaya aturannya selalu sama.
// Mengembalikan { error } kalau tidak valid, atau { value } berisi data yang siap disimpan.
export function validateTransaction(body) {
  const { amount, type, category, note, date } = body ?? {}

  if (amount === undefined || amount === null || amount === '' || !type || !category || !date) {
    return { error: 'Jumlah, tipe, kategori, dan tanggal wajib diisi' }
  }

  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0 || value > 1_000_000_000_000) {
    return { error: 'Jumlah harus antara 0 dan 1 triliun' }
  }

  if (!['income', 'expense'].includes(type)) {
    return { error: 'Tipe tidak valid' }
  }

  if (typeof category !== 'string' || !category.trim() || category.length > 50) {
    return { error: 'Kategori tidak valid' }
  }

  if (!isValidDate(date)) {
    return { error: 'Tanggal tidak valid' }
  }

  if (note != null && (typeof note !== 'string' || note.length > 500)) {
    return { error: 'Catatan tidak valid' }
  }

  return {
    value: {
      amount: value,
      type,
      category: category.trim(),
      note: note?.trim() || null,
      date,
    },
  }
}