// Judul halaman (serif italic) dengan keterangan opsional di bawahnya
export default function PageHeader({ title, description, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-xl font-serif italic text-parchment">{title}</h2>
      {description && <p className="text-sm text-parchment-dim mt-1">{description}</p>}
    </div>
  )
}
