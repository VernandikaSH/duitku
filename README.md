# Duitku

Aplikasi web pencatat keuangan pribadi. Catat pemasukan & pengeluaran, lihat ringkasannya
lewat grafik, dan telusuri riwayat transaksi — semuanya dalam satu dashboard yang bersih.

Dibangun di atas **free tier sepenuhnya** (Supabase + Vercel), jadi bisa dipakai jangka
panjang tanpa biaya server.

**Cara kerja singkat:**

```
User login (Supabase Auth)
        ↓
Tambah transaksi (form → API route)
        ↓
Supabase — tabel `transactions`, diamankan RLS per-user
        ↓
Dashboard (grafik Recharts) + Riwayat (filter)
```

---

## Fitur

- **Autentikasi** — login & register via Supabase Auth, sesi auto-refresh lewat middleware
- **Catat transaksi** — form pemasukan/pengeluaran yang tersimpan lewat API route
- **Dashboard visual** — ringkasan saldo & grafik tren keuangan menggunakan Recharts
- **Riwayat transaksi** — daftar lengkap dengan filter
- **Data terisolasi per user** — Row Level Security (RLS) di Supabase memastikan satu user
  tidak bisa membaca data user lain, bahkan lewat request langsung ke API
- **Desain kalem** — palet hijau/biru custom lewat Tailwind, dirancang enak dilihat lama

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS (palet hijau/biru custom) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL) + Row Level Security |
| Grafik | Recharts |
| Hosting | Vercel |

**Struktur project:**

```
duitku/
├── app/
│   ├── layout.jsx           # Root layout
│   ├── page.jsx             # Redirect ke /dashboard atau /login
│   ├── globals.css          # Tailwind base styles
│   ├── login/ · register/   # Halaman autentikasi
│   ├── dashboard/           # Ringkasan + grafik
│   └── api/                 # API route transaksi
├── lib/
│   ├── supabase-browser.js  # Client untuk komponen 'use client'
│   └── supabase-server.js   # Client untuk server components & API routes
├── middleware.js            # Auto-refresh sesi login
├── supabase/
│   └── schema.sql           # Skema tabel transactions + RLS
└── .env.local.example
```

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
Buka http://localhost:3000

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
- **Middleware itu penting.** Tanpa `middleware.js`, sesi login akan expired diam-diam dan
  user tiba-tiba terlempar ke halaman login di tengah pemakaian.
- **Region Supabase tidak bisa diubah** setelah project dibuat. Kalau terlanjur salah pilih,
  harus buat project baru.
- **Environment variables di Vercel** harus dimasukkan manual — tidak terbawa dari `.env.local`,
  dan perlu **redeploy** setiap kali diubah.

---

## Saran Pengembangan

- **Kategori transaksi** — tambahkan kategori (makan, transport, tagihan) beserta breakdown
  pie chart di dashboard, supaya kelihatan uang paling banyak habis ke mana.
- **Budget & alert** — set batas pengeluaran bulanan per kategori, dengan indikator saat
  mendekati/melewati batas.
- **Transaksi berulang** — auto-input untuk pengeluaran rutin (langganan, cicilan, sewa).
- **Export data** — unduh riwayat sebagai CSV/Excel untuk keperluan rekap tahunan.
- **PWA / mode offline** — supaya bisa dipasang di HP dan tetap bisa mencatat saat sinyal
  hilang, lalu sinkron otomatis saat online.
- **Impor otomatis** — hubungkan dengan bot struk (seperti Telegram Nota Bot) agar transaksi
  bisa masuk lewat foto struk, bukan hanya input manual.
- **Multi-currency / multi-akun** — pisahkan saldo per dompet (cash, bank, e-wallet).

---