'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function RegisterPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      // Tampilkan pesan asli dari Supabase supaya lebih mudah di-debug
      console.error('Supabase signUp error:', error)
      setError(error.message === 'User already registered'
        ? 'Email sudah terdaftar. Coba login.'
        : `Gagal mendaftar: ${error.message}`)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
        <div className="w-full max-w-sm bg-panel border border-brass/15 rounded-lg p-8 text-center">
          <h1 className="text-xl font-serif italic text-brass-soft mb-2">Cek email kamu</h1>
          <p className="text-sm text-parchment-dim">
            Kami sudah mengirim link konfirmasi ke <strong className="text-parchment">{email}</strong>.
            Klik link tersebut untuk mengaktifkan akun, lalu kembali ke halaman login.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-brass-soft hover:underline text-sm"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-4">
      <div className="w-full max-w-sm bg-panel border border-brass/15 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif italic text-brass-soft">Duitku</h1>
          <p className="text-parchment-dim text-sm mt-2">Buat akun untuk mulai mencatat</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-charcoal2 border border-brass/20 px-3 py-2 text-sm text-parchment placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="Minimal 6 karakter"
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
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-parchment-dim mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-brass-soft hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
