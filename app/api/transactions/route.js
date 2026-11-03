import { NextResponse } from 'next/server'
import { requireUser, validateTransaction } from '@/lib/api'

// GET /api/transactions — ambil semua transaksi milik user yang login
// Query params opsional: ?from=YYYY-MM-DD&to=YYYY-MM-DD&category=Makan
export async function GET(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

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
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const body = await request.json().catch(() => null)
  const { error: invalid, value } = validateTransaction(body)
  if (invalid) {
    return NextResponse.json({ error: invalid }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({ user_id: user.id, ...value })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}