import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import DashboardClient from '@/components/DashboardClient'
import MonthNav from '@/components/MonthNav'
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

  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0]

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', firstDay)
    .lte('date', lastDay)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar active="dashboard" email={user.email} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <MonthNav year={year} month={month} />
      </div>

      <DashboardClient transactions={transactions || []} />
    </div>
  )
}