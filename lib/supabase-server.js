import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Dipakai di API routes dan server components — supaya sesi login user terbaca
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Terjadi kalau dipanggil dari Server Component (boleh diabaikan
            // karena middleware yang akan menangani refresh sesi)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch {}
        },
      },
    }
  )
}
