/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palet kalem hijau tosca + biru — nyaman dilihat untuk dipakai harian
        primary: {
          50: '#eefaf6',
          100: '#d5f0e6',
          400: '#4fb894',
          500: '#2f9d78',
          600: '#237e5f',
        },
        accent: {
          400: '#5b9bd5',
          500: '#3b7fc4',
        },
        surface: '#f7f9f8',
      },
    },
  },
  plugins: [],
}
