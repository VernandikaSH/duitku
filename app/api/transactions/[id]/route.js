import { NextResponse } from 'next/server'
import { requireUser, validateTransaction } from '@/lib/api'

// PUT /api/transactions/[id] — update transaksi
export async function PUT(request, { params }) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  // Aturan validasi sama persis dengan POST (tambah)
  const body = await request.json().catch(() => null)
  const { error: invalid, value } = validateTransaction(body)
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('transactions')
    .update(value)
    .eq('id', params.id)
    .eq('user_id', user.id) // pastikan hanya bisa update milik sendiri
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// DELETE /api/transactions/[id] — hapus transaksi
export async function DELETE(request, { params }) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}