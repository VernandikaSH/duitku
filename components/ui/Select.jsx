import { useId } from 'react'
import { FieldShell, controlClass, fieldAria } from './field'

// <Select label="Kategori" value={...} onChange={...}>
//   <option value="a">A</option>
// </Select>
// API sama dengan Input (label, optional, hint, error); <option> dikirim sebagai children
export default function Select({ label, optional, hint, error, id, className = '', ...props }) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <FieldShell id={selectId} label={label} optional={optional} hint={hint} error={error}>
      <select
        id={selectId}
        className={controlClass(error, className)}
        {...fieldAria(selectId, { hint, error })}
        {...props}
      />
    </FieldShell>
  )
}
