import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET /api/transactions — ambil semua transaksi milik user yang login
// Query params opsional: ?from=YYYY-MM-DD&to=YYYY-MM-DD&category=Makan
export async function GET(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const category = searchParams.get('category')

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (from) query = query.gte('date', from)
  if (to) query = query.lte('date', to)
  if (category) query = query.eq('category', category)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

// POST /api/transactions — tambah transaksi baru
export async function POST(request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { amount, type, category, note, date } = body

  // Validasi dasar di sisi server
  if (!amount || !type || !category || !date) {
    return NextResponse.json(
      { error: 'Jumlah, tipe, kategori, dan tanggal wajib diisi' },
      { status: 400 }
    )
  }

  if (!['income', 'expense'].includes(type)) {
    return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      amount: Number(amount),
      type,
      category,
      note: note || null,
      date,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}