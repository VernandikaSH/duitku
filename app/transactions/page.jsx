import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import TransactionsList from '@/components/TransactionsList'
import PageHeader from '@/components/ui/PageHeader'
import PageContainer from '@/components/ui/PageContainer'

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
    <>
      <Navbar active="transactions" email={user.email} />

      <PageContainer as="main" className="page-enter py-6 sm:py-10">
        <PageHeader title="Riwayat Transaksi" />
        <TransactionsList initialTransactions={transactions || []} />
      </PageContainer>
    </>
  )
}