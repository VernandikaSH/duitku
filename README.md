# Duitku — Setup Project

## Yang sudah dibuat di step ini

- Struktur folder Next.js (App Router)
- Konfigurasi Tailwind CSS dengan palet warna hijau/biru kalem
- Koneksi Supabase (client browser + server)
- Middleware auto-refresh sesi login
- Skema database `transactions` + Row Level Security (RLS)

## Langkah setup

### 1. Buat project Supabase (gratis)
1. Daftar di https://supabase.com
2. Buat New Project (pilih region Singapore untuk latensi terbaik dari Indonesia)
3. Tunggu ~2 menit sampai project siap

### 2. Jalankan skema database
1. Di dashboard Supabase, buka **SQL Editor**
2. Copy-paste isi file `supabase/schema.sql` dari project ini
3. Klik **Run**

### 3. Ambil API keys
1. Buka **Settings > API**
2. Copy **Project URL** dan **anon public key**

### 4. Setup environment variables
1. Copy file `.env.local.example` menjadi `.env.local`
2. Isi dengan URL dan anon key dari step 3

### 5. Install dependencies & jalankan lokal
```bash
npm install
npm run dev
```
Buka http://localhost:3000

## Struktur yang sudah ada
```
finance-app/
├── app/
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Redirect ke /dashboard atau /login
│   └── globals.css         # Tailwind base styles
├── lib/
│   ├── supabase-browser.js # Client untuk komponen 'use client'
│   └── supabase-server.js  # Client untuk server components & API routes
├── middleware.js           # Auto-refresh sesi login
├── supabase/
│   └── schema.sql          # Skema tabel transactions + RLS
└── .env.local.example
```

## Langkah selanjutnya
- [ ] Halaman login & register (`app/login`, `app/register`)
- [ ] Form tambah transaksi + API route
- [ ] Dashboard dengan grafik (Recharts)
- [ ] Halaman riwayat transaksi + filter
- [ ] Deploy ke Vercel
