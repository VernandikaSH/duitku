import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { formatDateLocal } from '@/lib/date'
import Navbar from '@/components/Navbar'
import CashflowView from '@/components/CashflowView'
import PageHeader from '@/components/ui/PageHeader'

const MONTHS_SHOWN = 12

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function signedAmount(t) {
  return t.type === 'income' ? Number(t.amount) : -Number(t.amount)
}

export default async function CashflowPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Rentang: awal bulan 11 bulan lalu s/d akhir bulan berjalan
  const now = new Date()
  const rangeStart = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1), 1)
  const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const startStr = formatDateLocal(rangeStart)

  const [{ data: inRange }, { data: before }] = await Promise.all([
    supabase
      .from('transactions')
      .select('amount, type, date')
      .eq('user_id', user.id)
      .gte('date', startStr)
      .lte('date', formatDateLocal(rangeEnd)),
    // Saldo awal = akumulasi semua transaksi sebelum rentang
    supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', user.id)
      .lt('date', startStr),
  ])

  const openingBalance = (before || []).reduce((sum, t) => sum + signedAmount(t), 0)

  // Siapkan 12 slot bulan (termasuk bulan tanpa transaksi)
  const months = []
  for (let i = 0; i < MONTHS_SHOWN; i++) {
    const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1)
    months.push({
      key: monthKey(d.getFullYear(), d.getMonth() + 1),
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      income: 0,
      expense: 0,
    })
  }
  const byKey = Object.fromEntries(months.map((m) => [m.key, m]))

  for (const t of inRange || []) {
    const slot = byKey[t.date.slice(0, 7)] // date = "YYYY-MM-DD"
    if (!slot) continue
    if (t.type === 'income') slot.income += Number(t.amount)
    else slot.expense += Number(t.amount)
  }

  let running = openingBalance
  const rows = months.map((m) => {
    const net = m.income - m.expense
    running += net
    return { ...m, net, balance: running }
  })

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar active="cashflow" email={user.email} />

      <main className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <PageHeader title="Cashflow" description="12 bulan terakhir" />
        <CashflowView rows={rows} openingBalance={openingBalance} />
      </main>
    </div>
  )
}
