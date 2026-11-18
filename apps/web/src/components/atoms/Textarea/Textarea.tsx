import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Fonte monoespaçada, para campos de código. */
  mono?: boolean
  /** `dark` para fundos cinza: o campo fica claro para se destacar. */
  tone?: 'light' | 'dark'
}

/** Mesmo visual do `Input`, para textos longos. */
export function Textarea({ mono = false, tone = 'light', className = '', ...props }: TextareaProps) {
  const background = tone === 'dark' ? 'bg-offwhite' : 'bg-cinza-medio'
  return (
    <textarea
      className={`w-full resize-y rounded px-4 py-2 text-base/normal text-cinza-escuro placeholder:text-cinza-escuro focus:outline-2 focus:outline-verde-destaque ${background} ${mono ? 'font-mono' : ''} ${className}`}
      {...props}
    />
  )
}
