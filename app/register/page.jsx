'use client'

import { useState } from 'react'
import TextLink from '@/components/ui/TextLink'
import { createClient } from '@/lib/supabase-browser'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'

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
      // Tampilkan pesan asli dari Supabase supaya lebih mudah di-debug.
      // Catatan: email yang sudah terdaftar TIDAK masuk ke sini selama konfirmasi email aktif;
      // Supabase membalas sukses tanpa mengirim email (lihat layar sukses di bawah).
      // 'User already registered' hanya muncul kalau konfirmasi email dimatikan.
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
      <AuthLayout className="text-center">
        <h1 className="text-xl font-serif italic text-brass-soft mb-2">Cek email kamu</h1>
        {/* Pesan sengaja netral: Supabase tidak memberi tahu apakah email sudah terdaftar
            (dan tidak mengirim email kalau sudah), supaya form ini tidak bisa dipakai
            untuk mengecek email siapa yang punya akun (email enumeration). */}
        <p className="text-sm text-parchment-dim">
          Kalau <strong className="text-parchment">{email}</strong> belum terdaftar, kami sudah mengirim
          link konfirmasi ke sana. Klik link tersebut untuk mengaktifkan akun.
        </p>
        <p className="text-sm text-parchment-dim mt-3">Sudah pernah daftar? Langsung login saja.</p>
        <TextLink href="/login" className="inline-block mt-6 text-sm">
          Ke halaman Login
        </TextLink>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      tagline="Buat akun untuk mulai mencatat"
      footer={
        <>
          Sudah punya akun?{' '}
          <TextLink href="/login">Masuk di sini</TextLink>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
        />

        <Input
          label="Password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="Minimal 6 karakter"
          placeholder="••••••••"
        />

        {error && (
          <Alert>{error}</Alert>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
