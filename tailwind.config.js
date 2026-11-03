/** @type {import('tailwindcss').Config} */
const { palette } = require('./lib/tokens')

module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // Semua warna didefinisikan di lib/tokens.js
      colors: palette,
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
