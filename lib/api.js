// Helper untuk API routes (server)
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Pastikan request berasal dari user yang login.
//   const { supabase, user, response } = await requireUser()
//   if (response) return response   // 401 kalau belum login
export async function requireUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  return { supabase, user }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

// Validasi data transaksi dari body request. Dipakai oleh POST (tambah) dan PUT (edit)
// supaya aturannya selalu sama.
// Mengembalikan { error } kalau tidak valid, atau { value } berisi data yang siap disimpan.
export function validateTransaction(body) {
  const { amount, type, category, note, date } = body ?? {}

  if (amount === undefined || amount === null || amount === '' || !type || !category || !date) {
    return { error: 'Jumlah, tipe, kategori, dan tanggal wajib diisi' }
  }

  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) {
    return { error: 'Jumlah harus angka lebih dari 0' }
  }

  if (!['income', 'expense'].includes(type)) {
    return { error: 'Tipe tidak valid' }
  }

  if (typeof category !== 'string' || !category.trim()) {
    return { error: 'Kategori tidak valid' }
  }

  if (typeof date !== 'string' || !DATE_RE.test(date) || Number.isNaN(Date.parse(date))) {
    return { error: 'Tanggal tidak valid' }
  }

  if (note != null && typeof note !== 'string') {
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
