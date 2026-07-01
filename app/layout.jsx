import './globals.css'

export const metadata = {
  title: 'Duitku — Manajemen Keuangan Pribadi',
  description: 'Catat dan pantau keuangan pribadimu dengan mudah',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen text-slate-800 antialiased">
        {children}
      </body>
    </html>
  )
}
