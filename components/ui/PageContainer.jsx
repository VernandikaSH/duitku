// Lebar & jarak samping standar halaman aplikasi (dipakai juga oleh navbar supaya sejajar).
// Jarak atas/bawah diatur per halaman lewat className.
export default function PageContainer({ as: Tag = 'div', className = '', ...props }) {
  return <Tag className={`max-w-4xl mx-auto px-4 sm:px-6 ${className}`} {...props} />
}
