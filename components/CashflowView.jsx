'use client'

import { useEffect, useRef, useState } from 'react'

// Warna mark grafik. Brass sengaja satu langkah lebih gelap dari `brass`
// tema supaya lolos validator palet (lightness band + beda warna untuk
// buta warna) terhadap `loss` di atas panel gelap.
const COLOR_IN = '#b5901e'
const COLOR_OUT = '#c1543f'
const COLOR_BALANCE = '#cfc9bb'
const COLOR_GRID = '#2a3a31'
const COLOR_SURFACE = '#16241d'
const COLOR_AXIS_TEXT = '#9c978a'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTH_LONG = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const M = { top: 12, right: 16, bottom: 36, left: 56 }

const rupiahFmt = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const compactFmt = new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 })

function formatRupiah(num) {
  return rupiahFmt.format(num)
}

function formatSigned(num) {
  return `${num > 0 ? '+' : num < 0 ? '-' : ''}${formatRupiah(Math.abs(num))}`
}

// ---------- Skala ----------

function niceStep(raw) {
  const exp = 10 ** Math.floor(Math.log10(raw))
  const f = raw / exp
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10
  return nice * exp
}

// Domain selalu memuat 0 supaya batang & garis punya baseline yang jujur
function niceScale(values, count = 4) {
  let min = Math.min(0, ...values)
  let max = Math.max(0, ...values)
  if (min === max) max = min + 1
  const step = niceStep((max - min) / count)
  const lo = Math.floor(min / step) * step
  const hi = Math.ceil(max / step) * step
  const ticks = []
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v))
  return { lo, hi, ticks }
}

function useWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, width]
}

// Batang dengan ujung data membulat 4px, sisi baseline tetap siku
function barPath(x, base, end, w, radius = 4) {
  const h = Math.abs(base - end)
  if (h < 0.5) return ''
  const r = Math.min(radius, h, w / 2)
  if (end < base) {
    return `M${x},${base} V${end + r} Q${x},${end} ${x + r},${end} H${x + w - r} Q${x + w},${end} ${x + w},${end + r} V${base} Z`
  }
  return `M${x},${base} V${end - r} Q${x},${end} ${x + r},${end} H${x + w - r} Q${x + w},${end} ${x + w},${end - r} V${base} Z`
}

// ---------- Kerangka grafik: grid, sumbu, area hover, tooltip ----------

function ChartFrame({ rows, height, values, ariaLabel, describe, renderMarks, renderOverlay }) {
  const [ref, width] = useWidth()
  const [active, setActive] = useState(null)

  const innerW = Math.max(0, width - M.left - M.right)
  const innerH = height - M.top - M.bottom
  const band = innerW / rows.length
  const { lo, hi, ticks } = niceScale(values)
  const y = (v) => M.top + innerH - ((v - lo) / (hi - lo)) * innerH
  const cx = (i) => M.left + band * i + band / 2

  const ctx = { y, cx, band, active, innerH, width }

  return (
    <div ref={ref} className="relative" style={{ height }}>
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={ariaLabel}
          onPointerLeave={() => setActive(null)}
          className="block overflow-visible"
        >
          {/* Grid + label sumbu Y */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke={COLOR_GRID} strokeWidth={1} />
              <text
                x={M.left - 8}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                fontSize={11}
                fill={COLOR_AXIS_TEXT}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {compactFmt.format(t)}
              </text>
            </g>
          ))}

          {/* Label sumbu X. Di layar sempit hanya selang-seling (bulan terbaru
              selalu berlabel); tahun ditulis saat berganti dari label sebelumnya. */}
          {(() => {
            const labeled = rows
              .map((r, i) => ({ r, i }))
              .filter(({ i }) => band >= 30 || (rows.length - 1 - i) % 2 === 0)
            return labeled.map(({ r, i }, n) => (
              <text key={r.key} x={cx(i)} y={height - M.bottom + 16} textAnchor="middle" fontSize={11} fill={COLOR_AXIS_TEXT}>
                {MONTH_SHORT[r.month - 1]}
                {(n === 0 || labeled[n - 1].r.year !== r.year) && (
                  <tspan x={cx(i)} dy="1.25em" fontSize={10} opacity={0.7}>
                    {r.year}
                  </tspan>
                )}
              </text>
            ))
          })()}

          {renderMarks(ctx)}
          {renderOverlay?.(ctx)}

          {/* Area hover/fokus: satu kolom penuh per bulan, lebih besar dari mark-nya */}
          {rows.map((r, i) => (
            <rect
              key={r.key}
              x={M.left + band * i}
              y={M.top}
              width={band}
              height={innerH}
              fill="transparent"
              tabIndex={0}
              aria-label={describe(r)}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="outline-none focus-visible:stroke-brass/40"
            />
          ))}
        </svg>
      )}

      {active !== null && width > 0 && (
        <Tooltip row={rows[active]} x={cx(active)} width={width} items={describe.items(rows[active])} />
      )}
    </div>
  )
}

function Tooltip({ row, x, width, items }) {
  const TIP_W = 176
  const left = Math.min(Math.max(x - TIP_W / 2, 0), width - TIP_W)
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 rounded-md border border-brass/20 bg-charcoal px-3 py-2 shadow-lg"
      style={{ left, width: TIP_W }}
    >
      <p className="text-xs text-parchment-dim mb-1.5">
        {MONTH_LONG[row.month - 1]} {row.year}
      </p>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span className="h-0.5 w-3 rounded-full shrink-0" style={{ backgroundColor: it.color }} />
            <span className="text-sm text-parchment font-medium">{it.value}</span>
            <span className="text-xs text-parchment-dim ml-auto">{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Legend({ items }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5 text-xs text-parchment-dim">
          {it.line ? (
            <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: it.color }} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: it.color }} />
          )}
          {it.label}
        </li>
      ))}
    </ul>
  )
}

function Card({ title, subtitle, children }) {
  return (
    <section className="bg-panel border border-brass/15 rounded-lg p-4 sm:p-6">
      <h3 className="text-sm text-parchment">{title}</h3>
      {subtitle && <p className="text-xs text-parchment-dim mt-0.5">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function dimmed(active, i) {
  return { opacity: active !== null && active !== i ? 0.45 : 1, transition: 'opacity 150ms ease' }
}

// ---------- Grafik ----------

function InOutChart({ rows }) {
  const describe = (r) =>
    `${MONTH_LONG[r.month - 1]} ${r.year}: pemasukan ${formatRupiah(r.income)}, pengeluaran ${formatRupiah(r.expense)}`
  describe.items = (r) => [
    { label: 'Masuk', value: formatRupiah(r.income), color: COLOR_IN },
    { label: 'Keluar', value: formatRupiah(r.expense), color: COLOR_OUT },
  ]

  return (
    <Card title="Pemasukan vs pengeluaran" subtitle="Per bulan, dalam Rupiah">
      <Legend items={[{ label: 'Pemasukan', color: COLOR_IN }, { label: 'Pengeluaran', color: COLOR_OUT }]} />
      <ChartFrame
        rows={rows}
        height={240}
        values={rows.flatMap((r) => [r.income, r.expense])}
        ariaLabel="Grafik batang pemasukan dan pengeluaran per bulan"
        describe={describe}
        renderMarks={({ y, cx, band, active }) => {
          const bw = Math.max(2, Math.min(12, (band - 10) / 2))
          return rows.map((r, i) => (
            <g key={r.key} style={dimmed(active, i)}>
              <path d={barPath(cx(i) - bw - 1, y(0), y(r.income), bw)} fill={COLOR_IN} />
              <path d={barPath(cx(i) + 1, y(0), y(r.expense), bw)} fill={COLOR_OUT} />
            </g>
          ))
        }}
      />
    </Card>
  )
}

function NetChart({ rows }) {
  const describe = (r) =>
    `${MONTH_LONG[r.month - 1]} ${r.year}: ${r.net >= 0 ? 'surplus' : 'defisit'} ${formatRupiah(Math.abs(r.net))}`
  describe.items = (r) => [
    { label: r.net >= 0 ? 'Surplus' : 'Defisit', value: formatSigned(r.net), color: r.net >= 0 ? COLOR_IN : COLOR_OUT },
  ]

  return (
    <Card title="Net per bulan" subtitle="Pemasukan dikurangi pengeluaran">
      <Legend items={[{ label: 'Surplus', color: COLOR_IN }, { label: 'Defisit', color: COLOR_OUT }]} />
      <ChartFrame
        rows={rows}
        height={220}
        values={rows.map((r) => r.net)}
        ariaLabel="Grafik batang net cashflow per bulan"
        describe={describe}
        renderMarks={({ y, cx, band, active }) => {
          const bw = Math.max(2, Math.min(20, band - 10))
          return rows.map((r, i) => (
            <path
              key={r.key}
              d={barPath(cx(i) - bw / 2, y(0), y(r.net), bw)}
              fill={r.net >= 0 ? COLOR_IN : COLOR_OUT}
              style={dimmed(active, i)}
            />
          ))
        }}
        renderOverlay={({ y, width }) => (
          // Garis nol sedikit lebih tegas dari grid supaya surplus/defisit terbaca
          <line x1={M.left} x2={width - M.right} y1={y(0)} y2={y(0)} stroke={COLOR_AXIS_TEXT} strokeOpacity={0.5} strokeWidth={1} />
        )}
      />
    </Card>
  )
}

function BalanceChart({ rows, openingBalance }) {
  const describe = (r) => `${MONTH_LONG[r.month - 1]} ${r.year}: saldo akhir bulan ${formatSigned(r.balance)}`
  describe.items = (r) => [{ label: 'Saldo', value: formatSigned(r.balance), color: COLOR_BALANCE }]

  const last = rows[rows.length - 1]

  return (
    <Card
      title="Saldo kumulatif"
      subtitle={`Saldo di akhir tiap bulan · saldo awal ${formatSigned(openingBalance)}`}
    >
      <ChartFrame
        rows={rows}
        height={220}
        values={rows.map((r) => r.balance)}
        ariaLabel="Grafik garis saldo kumulatif per bulan"
        describe={describe}
        renderMarks={({ y, cx }) => {
          const d = rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${cx(i)},${y(r.balance)}`).join(' ')
          const lx = cx(rows.length - 1)
          const ly = y(last.balance)
          return (
            <g>
              <path d={d} fill="none" stroke={COLOR_BALANCE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={lx} cy={ly} r={4} fill={COLOR_BALANCE} stroke={COLOR_SURFACE} strokeWidth={2} />
              <text x={lx} y={ly - 12} textAnchor="end" fontSize={11} fill="#ede8de">
                {compactFmt.format(last.balance)}
              </text>
            </g>
          )
        }}
        renderOverlay={({ y, cx, active, innerH }) =>
          active !== null && (
            <g pointerEvents="none">
              <line x1={cx(active)} x2={cx(active)} y1={M.top} y2={M.top + innerH} stroke={COLOR_AXIS_TEXT} strokeOpacity={0.5} />
              <circle cx={cx(active)} cy={y(rows[active].balance)} r={4} fill={COLOR_BALANCE} stroke={COLOR_SURFACE} strokeWidth={2} />
            </g>
          )
        }
      />
    </Card>
  )
}

// ---------- Ringkasan ----------

function StatTile({ label, value, tone }) {
  const color = tone === 'in' ? 'text-brass-soft' : tone === 'out' ? 'text-loss' : 'text-parchment'
  return (
    <div className="bg-panel border border-brass/15 rounded-lg p-4">
      <p className="text-xs text-parchment-dim mb-1">{label}</p>
      <p className={`text-lg sm:text-xl font-semibold ${color}`} style={{ fontVariantNumeric: 'proportional-nums' }}>
        {value}
      </p>
    </div>
  )
}

function SummaryTable({ rows }) {
  const newestFirst = rows.map((r, i) => ({ ...r, prevNet: i > 0 ? rows[i - 1].net : null })).reverse()

  return (
    <Card title="Ringkasan per bulan" subtitle="Bulan terbaru di atas">
      <div className="-mx-4 sm:mx-0 overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-xs text-parchment-dim border-b border-brass/15">
              <th className="text-left font-normal py-2 pl-4 sm:pl-0">Bulan</th>
              <th className="text-right font-normal py-2">Masuk</th>
              <th className="text-right font-normal py-2">Keluar</th>
              <th className="text-right font-normal py-2">Net</th>
              <th className="text-right font-normal py-2" title="Perubahan net dibanding bulan sebelumnya">Δ net</th>
              <th className="text-right font-normal py-2 pr-4 sm:pr-0">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {newestFirst.map((r) => {
              const delta = r.prevNet === null ? null : r.net - r.prevNet
              return (
                <tr key={r.key} className="border-b border-brass/10 last:border-0">
                  <td className="py-2.5 pl-4 sm:pl-0 text-parchment whitespace-nowrap">
                    {MONTH_SHORT[r.month - 1]} {r.year}
                  </td>
                  <td className="py-2.5 text-right text-parchment-dim">{formatRupiah(r.income)}</td>
                  <td className="py-2.5 text-right text-parchment-dim">{formatRupiah(r.expense)}</td>
                  <td className={`py-2.5 text-right ${r.net >= 0 ? 'text-brass-soft' : 'text-loss'}`}>
                    {formatSigned(r.net)}
                  </td>
                  <td className="py-2.5 text-right text-parchment-dim">{delta === null ? '—' : formatSigned(delta)}</td>
                  <td className="py-2.5 pr-4 sm:pr-0 text-right text-parchment">{formatSigned(r.balance)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function CashflowView({ rows, openingBalance }) {
  const totalIn = rows.reduce((s, r) => s + r.income, 0)
  const totalOut = rows.reduce((s, r) => s + r.expense, 0)
  const net = totalIn - totalOut
  const hasData = totalIn > 0 || totalOut > 0

  if (!hasData) {
    return (
      <div className="bg-panel border border-brass/15 rounded-lg p-8 text-center">
        <p className="text-sm text-parchment-dim">Belum ada transaksi dalam 12 bulan terakhir.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile label="Total masuk" value={formatRupiah(totalIn)} tone="in" />
        <StatTile label="Total keluar" value={formatRupiah(totalOut)} tone="out" />
        <StatTile label="Net 12 bulan" value={formatSigned(net)} tone={net >= 0 ? 'in' : 'out'} />
        <StatTile label="Saldo akhir" value={formatSigned(rows[rows.length - 1].balance)} />
      </div>

      <InOutChart rows={rows} />
      <NetChart rows={rows} />
      <BalanceChart rows={rows} openingBalance={openingBalance} />
      <SummaryTable rows={rows} />
    </div>
  )
}
