import Card from '@/components/ui/Card'
import Logo from '@/components/ui/Logo'

// Bingkai halaman login/register: kartu di tengah layar.
// - tagline   : kalimat di bawah logo; kalau kosong, header logo tidak ditampilkan
// - footer    : teks di bawah isi kartu, mis. "Belum punya akun? Daftar di sini"
// - className : tambahan untuk kartu, mis. "text-center"
export default function AuthLayout({ tagline, footer, className = '', children }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card padding="lg" className={`w-full max-w-sm ${className}`}>
        {tagline && (
          <div className="text-center mb-8">
            <Logo as="h1" size="lg" />
            <p className="text-parchment-dim text-sm mt-2">{tagline}</p>
          </div>
        )}

        {children}

        {footer && <p className="text-center text-sm text-parchment-dim mt-6">{footer}</p>}
      </Card>
    </main>
  )
}
