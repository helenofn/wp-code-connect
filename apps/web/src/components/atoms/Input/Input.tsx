import type { InputHTMLAttributes } from 'react'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded bg-cinza-medio px-4 py-2 text-base/normal text-cinza-escuro placeholder:text-cinza-escuro focus:outline-2 focus:outline-verde-destaque"
      {...props}
    />
  )
}
