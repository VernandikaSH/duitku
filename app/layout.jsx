import { Newsreader, Space_Grotesk } from 'next/font/google'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata = {
  title: 'Duitku — Manajemen Keuangan Pribadi',
  description: 'Catat dan pantau keuangan pribadimu dengan mudah',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${newsreader.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-charcoal text-parchment antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
