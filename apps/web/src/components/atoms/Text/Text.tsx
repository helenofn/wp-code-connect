import type { ReactNode } from 'react'

interface TextProps {
  variant?: 'lead' | 'muted'
  children: ReactNode
}

const variants = {
  lead: 'text-lg text-offwhite',
  muted: 'text-sm text-muted',
}

export function Text({ variant = 'lead', children }: TextProps) {
  return <p className={variants[variant]}>{children}</p>
}
