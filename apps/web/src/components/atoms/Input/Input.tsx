import type { InputHTMLAttributes } from 'react'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="h-12 w-full rounded-lg bg-field px-4 text-base text-ink placeholder:text-ink/60 focus:outline-2 focus:outline-primary"
      {...props}
    />
  )
}
