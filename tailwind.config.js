/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // "Brankas" (vault) palette — dark charcoal/bottle-green ground, single brass accent
        charcoal: '#14171A',
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
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-space-grotesk)', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
