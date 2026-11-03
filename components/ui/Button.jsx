// Kelas yang sama untuk semua varian.
// Tinggi tetap h-10 (40px), sama dengan Input/Select. Karena tingginya tetap,
// border di varian secondary tidak menambah tinggi (box-sizing: border-box).
const BASE =
  'inline-flex items-center justify-center h-10 px-4 rounded-md text-sm transition-colors ' +
  'disabled:cursor-not-allowed'

const VARIANTS = {
  primary: 'bg-brass enabled:hover:bg-brass-soft text-charcoal font-medium disabled:opacity-60',
  secondary: 'text-parchment-dim enabled:hover:text-parchment border border-line enabled:hover:border-brass/40 disabled:opacity-60',
  danger: 'text-parchment bg-loss enabled:hover:bg-loss-dim font-medium disabled:opacity-60',
}

// - variant   : primary (default) | secondary | danger
// - type      : default "button", supaya tombol di dalam <form> tidak ikut submit tanpa sengaja.
//               Tombol kirim form harus menulis type="submit" secara eksplisit.
// - className : lebar/posisi saja (mis. "w-full"); tinggi & padding sudah diatur di sini
export default function Button({ variant = 'primary', type = 'button', className = '', ...props }) {
  return <button type={type} className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />
}
