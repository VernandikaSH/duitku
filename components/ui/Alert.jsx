const TONES = {
  error: 'text-loss bg-tint-loss border-line-danger',
}

// Kotak pesan, mis. error form.
// role="alert" membuat pembaca layar langsung membacakan pesannya saat muncul.
export default function Alert({ tone = 'error', className = '', ...props }) {
  return (
    <p
      role="alert"
      className={`text-sm border rounded-md px-3 py-2 ${TONES[tone]} ${className}`}
      {...props}
    />
  )
}
