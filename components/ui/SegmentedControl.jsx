// Pilihan satu dari beberapa opsi dalam bentuk tombol berdampingan,
// mis. Pengeluaran / Pemasukan.
// - options : [{ value, label, tone }] — tone = warna saat terpilih: "brass" (default) | "loss"
// - value   : value yang sedang terpilih
// - onChange: dipanggil dengan value baru
// - label   : nama grup untuk pembaca layar (aria-label), mis. "Jenis transaksi"
//
// Tiap tombol memakai aria-pressed, jadi pembaca layar menyebut "ditekan / tidak ditekan".

const SELECTED = {
  brass: 'bg-tint-brass text-brass-soft border-line-accent',
  loss: 'bg-tint-loss text-loss border-line-danger',
}
const IDLE = 'bg-charcoal2 text-parchment-dim border-transparent hover:text-parchment'

export default function SegmentedControl({ options, value, onChange, label, className = '' }) {
  return (
    <div role="group" aria-label={label} className={`flex gap-2 ${className}`}>
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={selected}
            onClick={() => !selected && onChange(opt.value)}
            className={`flex-1 h-10 rounded-md border text-sm transition-colors ${
              selected ? SELECTED[opt.tone ?? 'brass'] : IDLE
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
