// Satu-satunya sumber warna aplikasi.
// Dipakai oleh tailwind.config.js (jadi kelas seperti bg-panel, text-brass)
// dan oleh kode JS yang butuh nilai warna mentah (mis. grafik SVG).
// Ditulis CommonJS supaya bisa di-require oleh tailwind.config.js.

// "#c9a227" + 0.15 -> "rgb(201 162 39 / 0.15)"
function withAlpha(hex, alpha) {
  const n = parseInt(hex.slice(1), 16)
  return `rgb(${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255} / ${alpha})`
}

// "Brankas" (vault): dasar charcoal/hijau botol gelap, satu aksen brass
const palette = {
  charcoal: '#14171a',
  charcoal2: '#1c2320',
  panel: '#16241d',
  brass: {
    DEFAULT: '#c9a227',
    dim: '#8c7530',
    soft: '#e4c563',
  },
  parchment: {
    DEFAULT: '#ede8de',
    dim: '#9c978a',
  },
  loss: {
    DEFAULT: '#c1543f',
    dim: '#8c4738',
  },
}

// Garis pemisah standar: brass tipis, otomatis ikut kalau brass diganti
palette.line = withAlpha(palette.brass.DEFAULT, 0.15)

// Warna mark grafik (SVG butuh nilai mentah, bukan kelas Tailwind).
// `in` sengaja satu langkah lebih gelap dari brass supaya lolos validator palet
// (lightness band + beda warna untuk buta warna) terhadap `out` di atas panel gelap.
const chart = {
  in: '#b5901e',
  out: palette.loss.DEFAULT,
  balance: '#cfc9bb',
  grid: '#2a3a31',
  surface: palette.panel,
  axisText: palette.parchment.dim,
  label: palette.parchment.DEFAULT,
}

module.exports = { palette, chart, withAlpha }
