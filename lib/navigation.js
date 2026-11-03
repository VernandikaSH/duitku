// True untuk klik kiri biasa tanpa tombol modifier.
// Klik tengah / Ctrl+klik / Cmd+klik dibiarkan ditangani browser (mis. buka tab baru),
// jadi link tetap berperilaku seperti link normal.
export function isPlainLeftClick(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
}
