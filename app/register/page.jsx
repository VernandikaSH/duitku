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
      <div className="min-h-screen flex items-center justify-center bg-surface px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
          <h1 className="text-xl font-semibold text-primary-600 mb-2">Cek email kamu</h1>
          <p className="text-sm text-slate-500">
            Kami sudah mengirim link konfirmasi ke <strong>{email}</strong>.
            Klik link tersebut untuk mengaktifkan akun, lalu kembali ke halaman login.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 text-primary-600 font-medium hover:underline text-sm"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-primary-600">Duitku</h1>
          <p className="text-slate-500 text-sm mt-1">Buat akun untuk mulai mencatat</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-primary-600 font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}