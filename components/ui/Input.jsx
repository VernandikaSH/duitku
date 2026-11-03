import { forwardRef, useId } from 'react'
import { CONTROL, FieldShell } from './field'

// <Input label="Email" type="email" ... />
// - label    : teks label (opsional); otomatis terhubung ke input lewat id
// - optional : tambahkan keterangan "(opsional)" di label
// Prop lain (type, value, onChange, required, ...) diteruskan ke <input>
// forwardRef supaya komponen lain (mis. MoneyInput) bisa mengatur kursor
const Input = forwardRef(function Input({ label, optional, id, className = '', ...props }, ref) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <FieldShell id={inputId} label={label} optional={optional}>
      <input ref={ref} id={inputId} className={`${CONTROL} ${className}`} {...props} />
    </FieldShell>
  )
})

export default Input
