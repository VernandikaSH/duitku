import { NextResponse } from 'next/server'
import { requireUser, validateTransaction, serverError } from '@/lib/api'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const notFound = () => NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 })

// PUT /api/transactions/[id] — update transaksi
export async function PUT(request, { params }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return notFound()

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
    .eq('id', id)
    .eq('user_id', user.id) // pastikan hanya bisa update milik sendiri
    .select()
    .maybeSingle()

  if (error) return serverError(error)
  if (!data) return notFound()

  return NextResponse.json({ data })
}

// DELETE /api/transactions/[id] — hapus transaksi
export async function DELETE(request, { params }) {
  const { id } = await params
  if (!UUID_RE.test(id)) return notFound()

  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id')

  if (error) return serverError(error)
  if (!data?.length) return notFound()

  return NextResponse.json({ success: true })
}