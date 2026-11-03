'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Elemen yang bisa menerima fokus lewat Tab
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// Popup modal: latar gelap blur, tutup dengan klik di luar atau tombol Escape.
// - open       : tampilkan atau tidak
// - onClose    : dipanggil saat klik di luar / Escape (cegah tutup dengan tidak memanggil apa-apa)
// - role       : "dialog" (default) atau "alertdialog" untuk konfirmasi
// - labelledBy : id elemen judul, atau pakai `label` kalau tidak ada judul yang terlihat
// - className  : lebar konten, mis. "max-w-sm"
//
// Aksesibilitas keyboard (focus management):
// 1. Saat dibuka, fokus pindah ke elemen pertama di dalam popup
//    (kecuali isi popup sudah memindahkan fokus sendiri, mis. input dengan autoFocus).
// 2. Tab / Shift+Tab berputar di dalam popup (focus trap), tidak bisa keluar ke halaman di belakang.
// 3. Saat ditutup, fokus kembali ke elemen yang tadi membuka popup.
//
// Dirender ke <body> lewat portal: wrapper halaman (.page-enter) punya animasi transform,
// yang membuat position: fixed di dalamnya relatif ke halaman, bukan ke layar.
export default function Dialog({ open, onClose, role = 'dialog', labelledBy, label, className = '', children }) {
  const panelRef = useRef(null)
  const openerRef = useRef(null)

  // onClose biasanya fungsi inline yang berubah tiap render. Disimpan di ref supaya
  // efek di bawah tidak berjalan ulang (dan memindahkan fokus) setiap kali parent render.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // Catat elemen pembuka SEBELUM isi popup dirender. Kalau dicatat di dalam useEffect,
  // input ber-autoFocus di dalam popup sudah lebih dulu mengambil fokus.
  if (open && openerRef.current === null && typeof document !== 'undefined') {
    openerRef.current = document.activeElement
  }

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current

    // 1. Pindahkan fokus ke dalam popup
    if (panel && !panel.contains(document.activeElement)) {
      ;(panel.querySelector(FOCUSABLE) ?? panel).focus()
    }

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab' || !panel) return

      // 2. Focus trap: dari elemen terakhir kembali ke pertama, dan sebaliknya
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (items.length === 0) {
        // Mis. semua tombol sedang disabled saat proses hapus: tahan fokus di panel
        e.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const outside = !panel.contains(active)

      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // 3. Kembalikan fokus ke pembuka (kalau masih ada di halaman, mis. tidak ikut terhapus)
      const opener = openerRef.current
      openerRef.current = null
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm px-4 py-6"
      onClick={() => onCloseRef.current?.()}
    >
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
        tabIndex={-1}
        className={`w-full max-h-full overflow-y-auto focus:outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}
