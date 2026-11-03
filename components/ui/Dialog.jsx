'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'

// Popup modal: latar gelap blur, tutup dengan klik di luar atau tombol Escape.
// - open       : tampilkan atau tidak
// - onClose    : dipanggil saat klik di luar / Escape (cegah tutup dengan tidak memanggil apa-apa)
// - role       : "dialog" (default) atau "alertdialog" untuk konfirmasi
// - labelledBy : id elemen judul, atau pakai `label` kalau tidak ada judul yang terlihat
// - className  : lebar konten, mis. "max-w-sm"
//
// Dirender ke <body> lewat portal: wrapper halaman (.page-enter) punya animasi transform,
// yang membuat position: fixed di dalamnya relatif ke halaman, bukan ke layar.
export default function Dialog({ open, onClose, role = 'dialog', labelledBy, label, className = '', children }) {
  useEffect(() => {
    if (!open) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/70 backdrop-blur-sm px-4 py-6"
      onClick={() => onClose?.()}
    >
      <div
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        className={`w-full max-h-full overflow-y-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
