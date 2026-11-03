import Link from 'next/link'

// Kelas yang sama untuk semua varian
const BASE = 'transition-colors disabled:cursor-not-allowed disabled:opacity-30'

// Hover memakai [&:not(:disabled)] (bukan enabled:) karena <a> tidak pernah
// cocok dengan :enabled, sehingga enabled:hover tidak akan jalan di Link.
const VARIANTS = {
  muted: 'text-parchment-dim [&:not(:disabled)]:hover:text-brass-soft',
  accent: 'text-brass-soft [&:not(:disabled)]:hover:underline',
  danger: 'text-loss [&:not(:disabled)]:hover:underline',
}

// Tombol/link berupa teks.
// - Ada href  → <Link>, untuk pindah halaman atau mengubah URL
// - Tanpa href → <button type="button">, untuk aksi di halaman yang sama
// Ukuran teks (mis. "text-xs") dikirim lewat className
export default function TextLink({ href, variant = 'accent', className = '', ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`

  if (href) {
    return <Link href={href} className={classes} {...props} />
  }
  return <button type="button" className={classes} {...props} />
}
