import { useId, type InputHTMLAttributes } from 'react'
import { Input } from '../../atoms/Input/Input'
import { Label } from '../../atoms/Label/Label'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function FormField({ label, ...inputProps }: FormFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...inputProps} />
    </div>
  )
}
