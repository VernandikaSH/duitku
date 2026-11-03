import { useLayoutEffect, useRef } from 'react'
import Input from './Input'
import { formatThousands } from '@/lib/format'

const MAX_DIGITS = 13 // sampai 9.999.999.999.999, masih aman untuk Number

// Taruh kursor tepat setelah digit ke-n (titik pemisah dilewati)
function placeCaret(el, digitsLeft) {
  let pos = 0
  let seen = 0
  while (pos < el.value.length && seen < digitsLeft) {
    if (/\d/.test(el.value[pos])) seen++
    pos++
  }
  el.setSelectionRange(pos, pos)
}

// Input nominal dengan pemisah ribuan otomatis: ketik 1000 -> tampil "1.000".
// - value         : string angka mentah tanpa titik, mis. "1000"
// - onValueChange : dipanggil dengan string angka mentah yang baru
// Prop lain (label, required, placeholder, ...) diteruskan ke Input
export default function MoneyInput({ value, onValueChange, ...props }) {
  const ref = useRef(null)
  const pendingCaret = useRef(null)

  function handleChange(e) {
    const el = e.target
    const caret = el.selectionStart ?? el.value.length
    // Posisi kursor dihitung dalam "jumlah digit di kirinya", karena titik bisa bertambah/berkurang
    const digitsLeft = el.value.slice(0, caret).replace(/\D/g, '').length
    const raw = el.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, MAX_DIGITS)

    if (raw === value) {
      // Angka tidak berubah (mis. mengetik huruf atau menghapus titik):
      // React tidak render ulang, jadi rapikan tampilan & kursor di sini
      el.value = formatThousands(raw)
      placeCaret(el, Math.min(digitsLeft, raw.length))
      return
    }

    pendingCaret.current = Math.min(digitsLeft, raw.length)
    onValueChange(raw)
  }

  // Setelah nilai baru dirender (titik mungkin bergeser), kembalikan kursor ke tempatnya
  useLayoutEffect(() => {
    if (pendingCaret.current === null || !ref.current) return
    placeCaret(ref.current, pendingCaret.current)
    pendingCaret.current = null
  })

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={formatThousands(value)}
      onChange={handleChange}
      {...props}
    />
  )
}
