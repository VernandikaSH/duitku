import { formatRupiah, formatSigned } from '@/lib/format'

// Nominal uang dengan warna sesuai arah: pemasukan emas, pengeluaran merah.
// - value  : angka
// - type   : "income" | "expense". Kalau diisi, warna & tanda mengikuti type
//            (value dianggap besaran). Kalau kosong, mengikuti tanda value.
// - signed : tampilkan tanda + / -
// - as     : elemen yang dirender (default span)
//
// <Amount value={t.amount} type={t.type} signed />  -> "+Rp 50.000" (emas)
// <Amount value={balance} />                        -> merah kalau negatif
export default function Amount({ value, type, signed = false, as: Tag = 'span', className = '', ...props }) {
  const isIncome = type ? type === 'income' : value >= 0
  const magnitude = Math.abs(value)
  const signedValue = type ? (isIncome ? magnitude : -magnitude) : value

  const text = signed ? formatSigned(signedValue) : formatRupiah(type ? magnitude : value)
  const color = isIncome ? 'text-brass-soft' : 'text-loss'

  return (
    <Tag className={`${color} ${className}`} {...props}>
      {text}
    </Tag>
  )
}
