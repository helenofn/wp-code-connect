import type { ReactNode } from 'react'

interface LabelProps {
  htmlFor: string
  /** `dark` para fundos claros (ex.: a seção de comentários). */
  tone?: 'light' | 'dark'
  children: ReactNode
}

export function Label({ htmlFor, tone = 'light', children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-lg/normal ${tone === 'dark' ? 'text-cinza-escuro' : 'text-offwhite'}`}
    >
      {children}
    </label>
  )
}
