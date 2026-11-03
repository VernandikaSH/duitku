// Label kecil berbentuk pil, mis. "Bulan Ini".
// Selalu font sans tegak, jadi aman ditaruh di dalam judul serif italic.
export default function Badge({ className = '', ...props }) {
  return (
    <span
      className={`inline-block rounded-full border border-brass/30 px-2 py-0.5 font-sans text-xs not-italic text-brass-soft ${className}`}
      {...props}
    />
  )
}
