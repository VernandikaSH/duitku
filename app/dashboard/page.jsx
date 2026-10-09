import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { formatDateLocal } from '@/lib/date'
import DashboardClient from '@/components/DashboardClient'
import MonthSwitcher from '@/components/MonthSwitcher'
import Navbar from '@/components/Navbar'

export default async function DashboardPage({ searchParams }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Bulan yang ditampilkan bisa diatur lewat ?month=YYYY-MM, default bulan berjalan
  const now = new Date()
  const monthParam = searchParams?.month // format: "2026-07"
  const [year, month] = monthParam
    ? monthParam.split('-').map(Number)
    : [now.getFullYear(), now.getMonth() + 1]

  const firstDay = formatDateLocal(new Date(year, month - 1, 1))
  const lastDay = formatDateLocal(new Date(year, month, 0))

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-charcoal">
      <Navbar active="dashboard" email={user.email} />

      <div className="page-enter">
        <MonthSwitcher year={year} month={month}>
          <DashboardClient transactions={transactions || []} />
        </MonthSwitcher>
      </div>
    </div>
  )
}