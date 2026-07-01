import { createBrowserClient } from '@supabase/ssr'

// Dipakai di komponen dengan 'use client' — misalnya form login, form transaksi
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
