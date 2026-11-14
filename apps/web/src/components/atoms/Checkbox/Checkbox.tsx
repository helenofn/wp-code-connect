import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-muted">
      <span className="relative flex size-6 items-center justify-center rounded border-2 border-field has-checked:border-primary">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
          {...props}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-4 text-primary opacity-0 peer-checked:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
      </span>
      {label}
    </label>
  )
}
