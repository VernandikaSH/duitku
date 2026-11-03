// Tombol besar bergaris putus-putus untuk menambah item baru,
// mis. "Tambah Transaksi Baru". Tampil sebagai tempat kosong yang mengundang diklik.
// Prop lain (onClick, aria-*, ...) diteruskan ke <button>.
export default function AddButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-center gap-2 py-6 rounded-lg border border-dashed border-brass/25 bg-panel/40 text-parchment-dim transition-colors hover:border-brass/50 hover:text-brass-soft ${className}`}
      {...props}
    >
      <span aria-hidden="true" className="text-xl">
        +
      </span>
      <span className="text-sm">{children}</span>
    </button>
  )
}
