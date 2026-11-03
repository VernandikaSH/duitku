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
      <AuthLayout className="text-center">
        <h1 className="text-xl font-serif italic text-brass-soft mb-2">Cek email kamu</h1>
        <p className="text-sm text-parchment-dim">
          Kami sudah mengirim link konfirmasi ke <strong className="text-parchment">{email}</strong>.
          Klik link tersebut untuk mengaktifkan akun, lalu kembali ke halaman login.
        </p>
        <TextLink href="/login" className="inline-block mt-6 text-sm">
          Kembali ke Login
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
          placeholder="Minimal 6 karakter"
        />

        {error && (
          <Alert>{error}</Alert>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5"
        >
          {loading ? 'Memproses...' : 'Daftar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
