import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import TransactionsList from '@/components/TransactionsList'

export default async function TransactionsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-surface">
      <Navbar active="transactions" email={user.email} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Riwayat Transaksi</h2>
        <TransactionsList initialTransactions={transactions || []} />
      </main>
    </div>
  )
}