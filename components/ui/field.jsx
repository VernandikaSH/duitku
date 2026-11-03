// Bagian bersama untuk Input dan Select: gaya kontrol dan label

// Tinggi tetap h-10 (40px), sama dengan Button, supaya semua kontrol
// (termasuk input tanggal yang di Chrome cenderung lebih tinggi) sejajar.
export const CONTROL =
  'w-full h-10 rounded-md bg-charcoal2 border border-line px-3 text-sm text-parchment ' +
  'placeholder:text-parchment-dim/50 focus:outline-none focus:ring-1 focus:ring-brass ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

export const LABEL = 'block text-sm text-parchment-dim mb-1'

// Bungkus kontrol dengan label yang terhubung lewat htmlFor/id.
// Tanpa label, kontrol dirender apa adanya.
export function FieldShell({ id, label, optional, children }) {
  if (!label) return children
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
        {optional && <span className="text-parchment-dim/60"> (opsional)</span>}
      </label>
      {children}
    </div>
  )
}
