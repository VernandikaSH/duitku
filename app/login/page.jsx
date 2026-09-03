'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError('Email atau password salah. Coba lagi.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm bg-panel border border-brass/15 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif italic text-brass-soft">Duitku</h1>
          <p className="text-parchment-dim text-sm mt-2">Masuk untuk mengatur keuanganmu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-parchment-dim mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-parchment-dim mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-loss bg-loss/10 border border-loss/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brass hover:bg-brass-soft text-charcoal font-medium rounded-md py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-parchment-dim mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-brass-soft hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
