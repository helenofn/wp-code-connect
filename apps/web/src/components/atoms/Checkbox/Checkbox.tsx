import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-base/normal text-cinza-medio">
      {/* O input real é invisível: o quadrado mostra o foco de teclado por ele (WCAG 2.4.7). */}
      <span className="relative flex size-6 items-center justify-center rounded border-2 border-cinza-medio has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-verde-destaque">
        <input
          id={id}
          type="checkbox"
          className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0"
          {...props}
        />
        <img src="/icons/check.svg" alt="" width={16} height={16} className="opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  )
}
