import Amount from '@/components/ui/Amount'
import { formatDateShort } from '@/lib/format'

// Satu baris transaksi: kategori, tanggal · catatan, dan nominal.
// - actions : elemen tambahan di kanan nominal (mis. tombol Edit/Hapus di Riwayat).
//             Kalau ada actions, di HP baris ditumpuk supaya tombol tidak berdesakan.
// Garis pemisah antar baris diatur oleh <ul className="divide-y divide-line">.
export default function TransactionRow({ transaction: t, actions }) {
  return (
    <li
      className={`flex justify-between py-3 gap-2 ${
        actions ? 'flex-col sm:flex-row sm:items-center' : 'items-center'
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm text-parchment">{t.category}</p>
        <p className="text-xs text-parchment-dim truncate">
          {formatDateShort(t.date)}
          {t.note ? ` · ${t.note}` : ''}
        </p>
      </div>
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <Amount value={t.amount} type={t.type} signed className="text-sm" />
        {actions}
      </div>
    </li>
  )
}
