import { useId } from 'react'
import { CONTROL, FieldShell } from './field'

// <Select label="Kategori" value={...} onChange={...}>
//   <option value="a">A</option>
// </Select>
// API sama dengan Input; <option> dikirim sebagai children
export default function Select({ label, optional, id, className = '', ...props }) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <FieldShell id={selectId} label={label} optional={optional}>
      <select id={selectId} className={`${CONTROL} ${className}`} {...props} />
    </FieldShell>
  )
}
