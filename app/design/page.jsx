import DesignCatalog from '@/components/DesignCatalog'

export const metadata = {
  title: 'Design System — Duitku',
  description: 'Katalog token dan komponen UI Duitku',
}

// Halaman publik (lihat middleware.js): hanya berisi contoh dengan data dummy
export default function DesignPage() {
  return <DesignCatalog />
}
