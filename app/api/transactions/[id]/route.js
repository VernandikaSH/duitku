import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// PUT /api/transactions/[id] — update transaksi
export async function PUT(request, { params }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { amount, type, category, note, date } = body

  const { data, error } = await supabase
    .from('transactions')
    .update({ amount: Number(amount), type, category, note: note || null, date })
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
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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