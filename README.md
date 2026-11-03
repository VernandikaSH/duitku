# Duitku

Aplikasi web pencatat keuangan pribadi. Catat pemasukan & pengeluaran, lihat ringkasan per bulan
dan tren 12 bulan lewat grafik, dan telusuri riwayat transaksi — semuanya dalam satu dashboard yang bersih.

Dibangun di atas **free tier sepenuhnya** (Supabase + Vercel), jadi bisa dipakai jangka
panjang tanpa biaya server.

**Cara kerja singkat:**

```
User login (Supabase Auth)
        ↓
Tambah / edit transaksi (form → API route, divalidasi di server)
        ↓
Supabase — tabel `transactions`, diamankan RLS per-user
        ↓
Dashboard (ringkasan bulanan) · Riwayat (filter) · Cashflow (grafik SVG 12 bulan)
```

---

## Fitur

- **Autentikasi** — login & register via Supabase Auth, sesi auto-refresh lewat middleware
- **Catat & edit transaksi** — form pemasukan/pengeluaran dengan kategori, nominal berformat
  ribuan otomatis (`1.000.000`), dan validasi yang sama di server untuk tambah maupun edit
- **Dashboard bulanan** — saldo, total pemasukan/pengeluaran, rincian per kategori, dan
  transaksi terbaru; ganti bulan lewat tombol atau pemilih bulan
- **Riwayat transaksi** — daftar lengkap dengan filter tanggal & kategori, paginasi,
  edit dan hapus lewat popup
- **Cashflow** — grafik pemasukan vs pengeluaran, net, dan saldo 12 bulan terakhir
  (digambar sendiri dengan SVG, tanpa library grafik)
- **Data terisolasi per user** — Row Level Security (RLS) di Supabase memastikan satu user
  tidak bisa membaca data user lain, bahkan lewat request langsung ke API
- **Design system sendiri** — token warna dan komponen UI yang dipakai di seluruh aplikasi,
  dengan katalog publik di [`/design`](#design-system)
- **Aksesibel** — label terhubung ke input, error field dibacakan pembaca layar,
  popup bisa dipakai penuh dengan keyboard (focus trap)

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) + React 18 |
| Styling | Tailwind CSS, warna dari token di `lib/tokens.js` (tema "Brankas": charcoal + brass) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) + Row Level Security |
| Grafik | SVG custom (`components/CashflowView.jsx`) |
| Hosting | Vercel |

**Struktur project:**

```
duitku/
├── app/
│   ├── layout.jsx             # Root layout (font, warna dasar)
│   ├── page.jsx               # Redirect ke /dashboard atau /login
│   ├── globals.css            # Tailwind base + animasi
│   ├── login/ · register/     # Halaman autentikasi
│   ├── dashboard/             # Ringkasan bulanan
│   ├── transactions/          # Riwayat + filter
│   ├── cashflow/              # Grafik 12 bulan
│   ├── design/                # Katalog design system (publik)
│   └── api/transactions/      # API route tambah/ambil/edit/hapus
├── components/
│   ├── ui/                    # Design system: komponen umum (Button, Input, Card, Dialog, ...)
│   └── *.jsx                  # Komponen domain Duitku (TransactionForm, TransactionRow, MonthNav, ...)
├── lib/
│   ├── tokens.js              # Sumber tunggal warna (dipakai Tailwind & grafik)
│   ├── format.js              # Format Rupiah, tanggal, pemisah ribuan
│   ├── date.js                # Nama bulan, format bulan, tanggal lokal
│   ├── api.js                 # requireUser() & validateTransaction() untuk API route
│   ├── categories.js          # Daftar kategori pemasukan/pengeluaran
│   ├── navigation.js          # Helper klik (klik tengah/Ctrl tetap buka tab baru)
│   ├── supabase-browser.js    # Client untuk komponen 'use client'
│   └── supabase-server.js     # Client untuk server components & API routes
├── middleware.js              # Auto-refresh sesi login + proteksi halaman
├── scripts/reset-password.mjs # Utilitas admin sekali pakai (butuh service_role key)
├── supabase/
│   └── schema.sql             # Skema tabel transactions + RLS
└── .env.local.example
```

---

## Design System

Katalog lengkap bisa dibuka tanpa login di **`/design`** — semua contoh di sana memakai
komponen asli aplikasi, lengkap dengan potongan kodenya.

**Token** — `lib/tokens.js` adalah satu-satunya sumber warna. `tailwind.config.js` memakainya
untuk kelas seperti `bg-panel` / `text-brass`, dan grafik SVG memakai nilai yang sama lewat
`import { chart } from '@/lib/tokens'`. Warna garis `line` dihitung dari `brass`, jadi ikut
berubah kalau warna aksen diganti.

**Komponen `components/ui/`:**

| Kelompok | Komponen |
|---|---|
| Aksi | `Button` (primary/secondary/danger, tinggi tetap 40px), `TextLink` (otomatis `<Link>` atau `<button>`), `AddButton` |
| Form | `Input`, `Select`, `MoneyInput` — label, `hint`, dan `error` terhubung lewat `useId` + `aria-describedby`; `SegmentedControl` (`aria-pressed`) |
| Tata letak | `Card` (padding sm/md/lg), `PageContainer`, `Dialog` (portal + focus trap) |
| Teks & data | `PageHeader`, `SectionHeader`, `EmptyState`, `Logo`, `Badge`, `Alert`, `Amount` |

**Aturan yang dipegang:**

- Komponen di `ui/` tidak tahu soal data Duitku; komponen yang tahu soal transaksi/bulan
  (mis. `TransactionRow`, `MonthNav`) tinggal di `components/`.
- Sesuatu baru dijadikan komponen setelah polanya berulang, bukan sebelumnya.
- `className` dari luar hanya untuk lebar/posisi. Ukuran, warna, dan state diatur di komponen,
  supaya tidak ada kelas Tailwind yang saling bertabrakan.
- State tidak boleh hanya terlihat — juga harus terbaca: `disabled` mematikan hover,
  error memakai `aria-invalid`, tombol pilihan memakai `aria-pressed`.

---

## Langkah Pengerjaan (Ringkas)

**1. Buat project Supabase (gratis)**
Daftar di [supabase.com](https://supabase.com) → New Project → pilih region **Singapore**
(latensi terbaik dari Indonesia) → tunggu ~2 menit sampai siap.

**2. Jalankan skema database**
Dashboard Supabase → **SQL Editor** → copy-paste isi `supabase/schema.sql` → **Run**.
Ini membuat tabel `transactions` sekaligus policy RLS-nya.

**3. Setup environment variables**
Ambil **Project URL** + **anon public key** dari **Settings → API**, lalu:
```bash
cp .env.local.example .env.local
```
Isi kedua value tersebut ke `.env.local`.

**4. Install & jalankan lokal**
```bash
npm install
npm run dev
```
Buka http://localhost:3000 (katalog komponen di http://localhost:3000/design)

**5. Deploy ke Vercel**
Push ke GitHub → import repo di Vercel → masukkan environment variables yang sama
seperti di `.env.local` → Deploy.

---

## Catatan

- **`.env.local` jangan ikut ter-commit.** Meski `anon key` memang aman diekspos ke browser,
  tetap biasakan lewat environment variable — bukan hardcode.
- **Keamanan bertumpu pada RLS, bukan pada UI.** Karena `anon key` bisa dilihat siapa saja
  dari sisi klien, policy RLS di `schema.sql` adalah lapisan pertahanan yang sebenarnya.
  Kalau menambah tabel baru, **wajib** ikut menulis policy-nya — tabel tanpa RLS = data
  terbuka untuk semua orang.
- **Validasi ada di server.** Pengecekan di form hanya untuk umpan balik cepat;
  `validateTransaction()` di `lib/api.js` tetap memeriksa ulang setiap tambah & edit.
- **Middleware itu penting.** Tanpa `middleware.js`, sesi login akan expired diam-diam dan
  user tiba-tiba terlempar ke halaman login di tengah pemakaian. Middleware juga yang
  menentukan halaman publik (`/login`, `/register`, `/design`).
- **Region Supabase tidak bisa diubah** setelah project dibuat. Kalau terlanjur salah pilih,
  harus buat project baru.
- **Environment variables di Vercel** harus dimasukkan manual — tidak terbawa dari `.env.local`,
  dan perlu **redeploy** setiap kali diubah.

---

## Saran Pengembangan

- **Budget & alert** — set batas pengeluaran bulanan per kategori, dengan indikator saat
  mendekati/melewati batas.
- **Transaksi berulang** — auto-input untuk pengeluaran rutin (langganan, cicilan, sewa).
- **Export data** — unduh riwayat sebagai CSV/Excel untuk keperluan rekap tahunan.
- **PWA / mode offline** — supaya bisa dipasang di HP dan tetap bisa mencatat saat sinyal
  hilang, lalu sinkron otomatis saat online.
- **Impor otomatis** — hubungkan dengan bot struk (seperti Telegram Nota Bot) agar transaksi
  bisa masuk lewat foto struk, bukan hanya input manual.
- **Multi-currency / multi-akun** — pisahkan saldo per dompet (cash, bank, e-wallet).
- **Token spacing & tipografi** — saat ini token baru mencakup warna; ukuran teks dan jarak
  masih memakai skala bawaan Tailwind.

---
