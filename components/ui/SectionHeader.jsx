// Judul bagian di dalam Card.
// - title    : judul (terang)
// - subtitle : keterangan kecil di bawah judul (redup), opsional
// - action   : elemen di sisi kanan, mis. <TextLink>Lihat semua</TextLink>
export default function SectionHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex justify-between gap-3 ${subtitle ? 'items-start' : 'items-center'} ${className}`}>
      <div className="min-w-0">
        <h3 className="text-sm text-parchment">{title}</h3>
        {subtitle && <p className="text-xs text-parchment-dim mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
