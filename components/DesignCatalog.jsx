'use client'

import { useState } from 'react'
import { palette, chart } from '@/lib/tokens'

import AddButton from '@/components/ui/AddButton'
import Alert from '@/components/ui/Alert'
import Amount from '@/components/ui/Amount'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import Logo from '@/components/ui/Logo'
import MoneyInput from '@/components/ui/MoneyInput'
import PageContainer from '@/components/ui/PageContainer'
import PageHeader from '@/components/ui/PageHeader'
import SectionHeader from '@/components/ui/SectionHeader'
import SegmentedControl from '@/components/ui/SegmentedControl'
import Select from '@/components/ui/Select'
import TextLink from '@/components/ui/TextLink'
import MonthNav from '@/components/MonthNav'
import TransactionRow from '@/components/TransactionRow'

// ---------- Kerangka katalog ----------

const SECTIONS = [
  ['warna', 'Warna'],
  ['tipografi', 'Tipografi'],
  ['button', 'Button'],
  ['textlink', 'TextLink'],
  ['form', 'Form'],
  ['segmented', 'SegmentedControl'],
  ['card', 'Card'],
  ['feedback', 'Alert & EmptyState'],
  ['badge', 'Badge & AddButton'],
  ['amount', 'Amount'],
  ['dialog', 'Dialog'],
  ['domain', 'Komponen domain'],
]

function Section({ id, title, description, children }) {
  return (
    <Card as="section" id={id} className="scroll-mt-6">
      <SectionHeader title={title} subtitle={description} className="mb-5" />
      <div className="space-y-5">{children}</div>
    </Card>
  )
}

// Satu contoh: label kecil, tampilan hidup, lalu potongan kode
function Example({ label, code, children }) {
  return (
    <div>
      {label && <p className="text-xs text-parchment-dim mb-2">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
      {code && (
        <pre className="mt-3 overflow-x-auto rounded-md border border-line bg-charcoal2 p-3 text-xs leading-relaxed text-parchment-dim">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}

// ---------- Warna ----------

// { brass: { DEFAULT, dim, soft } } -> [{ name: 'brass', value }, { name: 'brass-dim', value }, ...]
function flattenPalette(obj) {
  return Object.entries(obj).flatMap(([name, value]) =>
    typeof value === 'string'
      ? [{ name, value }]
      : Object.entries(value).map(([shade, v]) => ({ name: shade === 'DEFAULT' ? name : `${name}-${shade}`, value: v }))
  )
}

function Swatch({ name, value, hint }) {
  return (
    <div className="min-w-0">
      {/* Warna ditampilkan lewat style, karena kelas Tailwind dinamis (bg-${name}) tidak ikut di-generate */}
      <div className="h-12 rounded-md border border-line" style={{ backgroundColor: value }} />
      <p className="mt-1.5 text-xs text-parchment truncate">{name}</p>
      <p className="text-xs text-parchment-dim truncate">{hint ?? value}</p>
    </div>
  )
}

// ---------- Halaman ----------

export default function DesignCatalog() {
  const [amount, setAmount] = useState('1500000')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [txType, setTxType] = useState('expense')
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() + 1 }
  })

  function shiftMonth(delta) {
    const d = new Date(month.year, month.month - 1 + delta, 1)
    setMonth({ year: d.getFullYear(), month: d.getMonth() + 1 })
  }

  const demoTransactions = [
    { id: 1, category: 'Gaji', date: '2026-11-01', note: 'Gaji November', amount: 8500000, type: 'income' },
    { id: 2, category: 'Makan & Minum', date: '2026-11-02', note: 'Makan siang bareng tim', amount: 75000, type: 'expense' },
  ]

  return (
    <PageContainer as="main" className="page-enter py-8 sm:py-12">
      <div className="mb-8">
        <Logo />
        <PageHeader
          title="Design System"
          description="Token dan komponen yang dipakai di seluruh aplikasi. Semua contoh di halaman ini memakai komponen yang sama dengan aplikasinya."
          className="mt-4 mb-0"
        />
        <nav aria-label="Bagian katalog" className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {SECTIONS.map(([id, label]) => (
            <TextLink key={id} href={`#${id}`} variant="muted" className="text-sm">
              {label}
            </TextLink>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        <Section id="warna" title="Warna" description="Sumber tunggal: lib/tokens.js, dipakai Tailwind dan grafik">
          <Example label="Palet tema (kelas Tailwind: bg-*, text-*, border-*)">
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              {flattenPalette(palette).map((c) => (
                <Swatch key={c.name} {...c} hint={c.name === 'line' ? 'brass / 15%' : undefined} />
              ))}
            </div>
          </Example>
          <Example label="Warna grafik (import { chart } from '@/lib/tokens')">
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(chart).map(([name, value]) => (
                <Swatch key={name} name={`chart.${name}`} value={value} />
              ))}
            </div>
          </Example>
        </Section>

        <Section id="tipografi" title="Tipografi" description="Serif italic untuk merek & judul halaman, sans untuk isi">
          <Example label="Logo — size sm (navbar) & lg (login)" code={`<Logo />\n<Logo as="h1" size="lg" />`}>
            <Logo />
            <Logo size="lg" />
          </Example>
          <Example label="PageHeader" code={`<PageHeader title="Cashflow" description="12 bulan terakhir" />`}>
            <PageHeader title="Cashflow" description="12 bulan terakhir" className="mb-0" />
          </Example>
          <Example
            label="SectionHeader — dengan subtitle & action"
            code={`<SectionHeader\n  title="Transaksi terbaru"\n  subtitle="5 terakhir bulan ini"\n  action={<TextLink href="/transactions">Lihat semua</TextLink>}\n/>`}
          >
            <div className="w-full">
              <SectionHeader
                title="Transaksi terbaru"
                subtitle="5 terakhir bulan ini"
                action={
                  <TextLink href="#tipografi" className="text-sm">
                    Lihat semua
                  </TextLink>
                }
              />
            </div>
          </Example>
        </Section>

        <Section
          id="button"
          title="Button"
          description="Tombol aksi. Tinggi tetap 40px (sama dengan Input), default type=&quot;button&quot;, hover tidak aktif saat disabled"
        >
          <Example
            label="variant"
            code={`<Button>Simpan</Button>\n<Button variant="secondary">Batal</Button>\n<Button variant="danger">Hapus</Button>`}
          >
            <Button>Simpan</Button>
            <Button variant="secondary">
              Batal
            </Button>
            <Button variant="danger">
              Hapus
            </Button>
          </Example>
          <Example label="disabled" code={`<Button disabled={loading}>Memproses...</Button>`}>
            <Button disabled>
              Memproses...
            </Button>
            <Button variant="secondary" disabled>
              Batal
            </Button>
            <Button variant="danger" disabled>
              Menghapus...
            </Button>
          </Example>
          <Example label="Lebar penuh — tinggi tetap 40px, lebar lewat className" code={`<Button type="submit" className="w-full">Masuk</Button>`}>
            <Button className="w-full">Masuk</Button>
          </Example>
          <Example
            label="Sejajar dengan Input — tinggi sama, tanpa atur padding"
            code={`<div className="flex items-end gap-3">\n  <Input label="Cari" placeholder="Nama kategori..." />\n  <Button variant="secondary">Reset</Button>\n</div>`}
          >
            <div className="flex w-full items-end gap-3">
              <div className="flex-1">
                <Input label="Cari" placeholder="Nama kategori..." />
              </div>
              <Button variant="secondary">Reset</Button>
            </div>
          </Example>
        </Section>

        <Section
          id="textlink"
          title="TextLink"
          description="Tombol/link berupa teks. Dengan href → <Link>, tanpa href → <button>"
        >
          <Example
            label="variant"
            code={`<TextLink href="/transactions">Lihat semua</TextLink>\n<TextLink variant="muted" onClick={prev}>Sebelumnya</TextLink>\n<TextLink variant="danger" onClick={remove}>Hapus</TextLink>`}
          >
            <TextLink href="#textlink" className="text-sm">
              accent (default)
            </TextLink>
            <TextLink variant="muted" className="text-sm">
              muted
            </TextLink>
            <TextLink variant="danger" className="text-sm">
              danger
            </TextLink>
          </Example>
          <Example label="disabled (hanya untuk <button>)" code={`<TextLink variant="muted" disabled={page === 1}>Sebelumnya</TextLink>`}>
            <TextLink variant="muted" disabled className="text-sm">
              Sebelumnya
            </TextLink>
            <TextLink variant="muted" className="text-sm">
              Berikutnya
            </TextLink>
          </Example>
        </Section>

        <Section
          id="form"
          title="Form"
          description="Tinggi seragam 40px. Label, hint, dan error otomatis terhubung ke input (useId + aria-describedby)"
        >
          <Example
            code={`<Input label="Email" type="email" placeholder="nama@email.com" />\n<Select label="Kategori">...</Select>\n<MoneyInput label="Jumlah (Rp)" value={amount} onValueChange={setAmount} />\n<Input label="Catatan" optional />`}
          >
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" placeholder="nama@email.com" />
              <Select label="Kategori" defaultValue="Belanja">
                <option>Makan & Minum</option>
                <option>Belanja</option>
                <option>Transport</option>
              </Select>
              <MoneyInput label="Jumlah (Rp)" value={amount} onValueChange={setAmount} placeholder="50.000" />
              <Input label="Tanggal" type="date" defaultValue="2026-11-03" />
              <Input label="Catatan" optional placeholder="Misal: makan siang bareng tim" />
              <Input label="Disabled" disabled defaultValue="Tidak bisa diubah" />
            </div>
          </Example>
          <p className="text-xs text-parchment-dim">
            Nilai mentah MoneyInput: <code className="text-parchment">&quot;{amount}&quot;</code> — titik ribuan hanya untuk tampilan.
          </p>
          <Example
            label="hint & error — error menggantikan hint, border merah, aria-invalid aktif"
            code={`<Input label="Password" type="password" hint="Minimal 6 karakter" />\n<Input label="Jumlah (Rp)" error="Isi jumlah lebih dari 0" />`}
          >
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Password" type="password" hint="Minimal 6 karakter" placeholder="••••••••" />
              <Input label="Jumlah (Rp)" defaultValue="0" error="Isi jumlah lebih dari 0" />
              <Select label="Kategori" error="Pilih kategori" defaultValue="">
                <option value="" disabled>
                  Pilih kategori
                </option>
                <option>Belanja</option>
              </Select>
            </div>
          </Example>
        </Section>

        <Section
          id="segmented"
          title="SegmentedControl"
          description="Pilih satu dari beberapa opsi. Tiap tombol memakai aria-pressed"
        >
          <Example
            label={`Terpilih: "${txType}"`}
            code={`<SegmentedControl\n  label="Jenis transaksi"\n  value={type}\n  onChange={setType}\n  options={[\n    { value: 'expense', label: 'Pengeluaran', tone: 'loss' },\n    { value: 'income', label: 'Pemasukan', tone: 'brass' },\n  ]}\n/>`}
          >
            <SegmentedControl
              label="Jenis transaksi"
              value={txType}
              onChange={setTxType}
              className="w-full"
              options={[
                { value: 'expense', label: 'Pengeluaran', tone: 'loss' },
                { value: 'income', label: 'Pemasukan', tone: 'brass' },
              ]}
            />
          </Example>
        </Section>

        <Section id="card" title="Card" description="Panel dasar. Padding lebih rapat di HP, normal mulai layar sm">
          <Example code={`<Card padding="sm">...</Card>   // p-4\n<Card>...</Card>                // md: p-4 sm:p-6\n<Card padding="lg">...</Card>   // p-6 sm:p-8\n<Card as="form" onSubmit={...}>...</Card>`}>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              {['sm', 'md', 'lg'].map((p) => (
                <Card key={p} padding={p} className="bg-charcoal2">
                  <p className="text-sm text-parchment">padding=&quot;{p}&quot;</p>
                </Card>
              ))}
            </div>
          </Example>
        </Section>

        <Section id="feedback" title="Alert & EmptyState" description="Pesan error dan keadaan kosong">
          <Example label="Alert — role=&quot;alert&quot;, dibacakan pembaca layar saat muncul" code={`{error && <Alert>{error}</Alert>}`}>
            <div className="w-full">
              <Alert>Email atau password salah. Coba lagi.</Alert>
            </div>
          </Example>
          <Example label="EmptyState" code={`<EmptyState>Belum ada transaksi.</EmptyState>`}>
            <div className="w-full rounded-md border border-dashed border-line">
              <EmptyState>Belum ada transaksi.</EmptyState>
            </div>
          </Example>
        </Section>

        <Section id="badge" title="Badge & AddButton" description="Label pil kecil dan tombol tambah bergaris putus-putus">
          <Example label="Badge — aman di dalam judul serif italic" code={`<Badge>Bulan Ini</Badge>`}>
            <span className="font-serif italic text-parchment">
              November 2026 <Badge className="ml-2">Bulan Ini</Badge>
            </span>
          </Example>
          <Example label="AddButton" code={`<AddButton onClick={() => setShowForm(true)}>Tambah Transaksi Baru</AddButton>`}>
            <AddButton>Tambah Transaksi Baru</AddButton>
          </Example>
        </Section>

        <Section id="amount" title="Amount" description="Nominal Rupiah dengan warna & tanda sesuai arah">
          <Example
            code={`<Amount value={50000} type="income" signed />\n<Amount value={75000} type="expense" signed />\n<Amount value={balance} />   // merah kalau negatif`}
          >
            <Amount value={50000} type="income" signed className="text-sm" />
            <Amount value={75000} type="expense" signed className="text-sm" />
            <Amount value={1250000} className="text-sm" />
            <Amount value={-320000} className="text-sm" />
            <Amount value={4800000} className="text-3xl font-serif" />
          </Example>
        </Section>

        <Section
          id="dialog"
          title="Dialog"
          description="Popup modal. Fokus pindah ke dalam popup, Tab berputar di dalamnya (focus trap), Escape/klik luar menutup, lalu fokus kembali ke tombol pembuka"
        >
          <Example
            code={`<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  role="alertdialog"\n  labelledBy="judul"\n  className="max-w-sm"\n>\n  <Card>...</Card>\n</Dialog>`}
          >
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              Buka contoh dialog
            </Button>
          </Example>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            role="alertdialog"
            labelledBy="demo-dialog-title"
            className="max-w-sm"
          >
            <Card>
              <h3 id="demo-dialog-title" className="text-sm text-parchment mb-1">
                Hapus transaksi ini?
              </h3>
              <p className="text-sm text-parchment-dim mb-6">Ini hanya contoh — tidak ada data yang dihapus.</p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                  Batal
                </Button>
                <Button variant="danger" onClick={() => setDialogOpen(false)}>
                  Hapus
                </Button>
              </div>
            </Card>
          </Dialog>
        </Section>

        <Section
          id="domain"
          title="Komponen domain"
          description="Dibangun dari komponen ui/ di atas, tapi khusus untuk data Duitku (components/, bukan components/ui/)"
        >
          <Example
            label="MonthNav + MonthPicker — klik judul bulan untuk memilih"
            code={`<MonthNav year={year} month={month} onNavigate={shift} onSelect={goTo} />`}
          >
            <div className="w-full">
              <MonthNav
                year={month.year}
                month={month.month}
                onNavigate={shiftMonth}
                onSelect={(year, m) => setMonth({ year, month: m })}
              />
            </div>
          </Example>
          <Example
            label="TransactionRow — dengan & tanpa actions"
            code={`<ul className="divide-y divide-line">\n  <TransactionRow transaction={t} actions={<TextLink>Edit</TextLink>} />\n</ul>`}
          >
            <ul className="w-full divide-y divide-line">
              <TransactionRow transaction={demoTransactions[0]} />
              <TransactionRow
                transaction={demoTransactions[1]}
                actions={
                  <>
                    <TextLink className="text-xs">Edit</TextLink>
                    <TextLink variant="danger" className="text-xs">
                      Hapus
                    </TextLink>
                  </>
                }
              />
            </ul>
          </Example>
        </Section>
      </div>
    </PageContainer>
  )
}
