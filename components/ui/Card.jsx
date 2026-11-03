import { forwardRef } from 'react'

// Skala padding: lebih rapat di HP, normal mulai layar sm
const PADDING = {
  none: '', // atur sendiri lewat className (mis. toolbar tipis)
  sm: 'p-4',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
}

// Panel dasar aplikasi.
// - as      : elemen yang dirender (default div; bisa "section", "form", ...)
// - padding : none | sm | md (default) | lg
// forwardRef supaya ref (mis. untuk scroll) tetap sampai ke elemen aslinya
const Card = forwardRef(function Card({ as: Tag = 'div', padding = 'md', className = '', ...props }, ref) {
  return (
    <Tag
      ref={ref}
      className={`bg-panel border border-line rounded-lg ${PADDING[padding]} ${className}`}
      {...props}
    />
  )
})

export default Card
