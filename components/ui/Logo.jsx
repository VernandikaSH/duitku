const SIZES = {
  sm: 'text-lg', // navbar
  lg: 'text-3xl', // halaman login/register
}

// Nama aplikasi dalam gaya merek (serif italic, brass)
export default function Logo({ size = 'sm', as: Tag = 'span', className = '' }) {
  return <Tag className={`font-serif italic text-brass-soft ${SIZES[size]} ${className}`}>Duitku</Tag>
}
