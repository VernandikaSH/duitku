import { forwardRef, useId } from 'react'
import { FieldShell, controlClass, fieldAria } from './field'

// <Input label="Email" type="email" ... />
// - label    : teks label (opsional); otomatis terhubung ke input lewat id
// - optional : tambahkan keterangan "(opsional)" di label
// - hint     : teks bantuan di bawah input, mis. "Minimal 6 karakter"
// - error    : pesan error untuk field ini; border jadi merah, aria-invalid aktif,
//              dan pesannya dibacakan pembaca layar lewat aria-describedby
// Prop lain (type, value, onChange, required, ...) diteruskan ke <input>
// forwardRef supaya komponen lain (mis. MoneyInput) bisa mengatur kursor
const Input = forwardRef(function Input(
  { label, optional, hint, error, id, className = '', ...props },
  ref
) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <FieldShell id={inputId} label={label} optional={optional} hint={hint} error={error}>
      <input
        ref={ref}
        id={inputId}
        className={controlClass(error, className)}
        {...fieldAria(inputId, { hint, error })}
        {...props}
      />
    </FieldShell>
  )
})

export default Input
