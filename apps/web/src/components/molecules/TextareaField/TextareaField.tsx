import { useId, type ComponentProps } from 'react'
import { Label } from '../../atoms/Label/Label'
import { Textarea } from '../../atoms/Textarea/Textarea'

interface TextareaFieldProps extends ComponentProps<typeof Textarea> {
  label: string
}

/** Como o `FormField`, mas com um campo de texto longo. */
export function TextareaField({ label, tone = 'light', ...textareaProps }: TextareaFieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} tone={tone}>
        {label}
      </Label>
      <Textarea id={id} tone={tone} {...textareaProps} />
    </div>
  )
}
