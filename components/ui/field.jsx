// Bagian bersama untuk Input dan Select: gaya kontrol, label, hint, dan pesan error

// Tinggi tetap h-10 (40px), sama dengan Button, supaya semua kontrol
// (termasuk input tanggal yang di Chrome cenderung lebih tinggi) sejajar.
// Warna border & ring sengaja tidak ditaruh di sini, tapi dipilih per state di controlClass(),
// supaya tidak ada dua kelas warna yang bertabrakan (mis. border-line + border-loss).
const CONTROL_BASE =
  'w-full h-10 rounded-md bg-charcoal2 border px-3 text-sm text-parchment ' +
  'placeholder:text-parchment-faint focus:outline-none focus:ring-1 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

const CONTROL_STATE = {
  default: 'border-line focus:ring-brass',
  error: 'border-loss focus:ring-loss',
}

export function controlClass(error, className = '') {
  return `${CONTROL_BASE} ${CONTROL_STATE[error ? 'error' : 'default']} ${className}`
}

export const LABEL = 'block text-sm text-parchment-dim mb-1'

// id elemen keterangan yang dibacakan pembaca layar setelah label (aria-describedby).
// Kalau ada error, error yang dipakai (hint disembunyikan).
export function describedById(id, { hint, error }) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

// Atribut aksesibilitas untuk kontrol: tandai invalid & hubungkan ke teks hint/error
export function fieldAria(id, { hint, error }) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedById(id, { hint, error }),
  }
}

// Bungkus kontrol dengan label (htmlFor/id) dan teks hint/error di bawahnya.
// Tanpa label, hint, maupun error, kontrol dirender apa adanya.
export function FieldShell({ id, label, optional, hint, error, children }) {
  if (!label && !hint && !error) return children
  return (
    <div>
      {label && (
        <label htmlFor={id} className={LABEL}>
          {label}
          {/* Sewarna label (parchment-dim, kontras 5,5:1): ini info penting, jangan disamarkan */}
          {optional && ' (opsional)'}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-xs text-loss">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-parchment-dim">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
