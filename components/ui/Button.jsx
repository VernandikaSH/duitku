// Kelas yang sama untuk semua varian
const BASE = 'rounded-md text-sm transition-colors disabled:cursor-not-allowed'

const VARIANTS = {
  primary: 'bg-brass enabled:hover:bg-brass-soft text-charcoal font-medium disabled:opacity-60',
  secondary: 'text-parchment-dim enabled:hover:text-parchment border border-line enabled:hover:border-brass/40 disabled:opacity-60',
  danger: 'text-parchment bg-loss enabled:hover:bg-loss-dim font-medium disabled:opacity-60',
}

// Ukuran dan lebar (mis. "w-full py-2.5") dikirim lewat className
export default function Button({ variant = 'primary', className = '', ...props }) {
  return <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />
}
