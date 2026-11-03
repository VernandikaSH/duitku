'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TextLink from '@/components/ui/TextLink'
import { createClient } from '@/lib/supabase-browser'
import AuthLayout from '@/components/AuthLayout'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'

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

    if (error) {
      setError('Email atau password salah. Coba lagi.')
      setLoading(false)
      return
    }

    // Saat berhasil, loading sengaja tidak dimatikan: tombol tetap "Memproses..."
    // sampai halaman pindah ke dashboard, supaya tidak bisa diklik ulang.

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <AuthLayout
      tagline="Masuk untuk mengatur keuanganmu"
      footer={
        <>
          Belum punya akun?{' '}
          <TextLink href="/register">Daftar di sini</TextLink>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
    </AuthLayout>
  )
}
