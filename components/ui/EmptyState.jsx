// Teks saat daftar/data kosong, mis. "Belum ada transaksi."
export default function EmptyState({ children, className = '' }) {
  return <p className={`text-sm text-parchment-dim text-center py-8 ${className}`}>{children}</p>
}
