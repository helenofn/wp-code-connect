import type { ReactNode } from 'react'

interface TextProps {
  variant?: 'lead' | 'body' | 'small'
  children: ReactNode
}

const variants = {
  lead: 'text-2xl/normal text-offwhite',
  body: 'text-lg/normal text-offwhite',
  small: 'text-base/normal text-offwhite',
}

export function Text({ variant = 'lead', children }: TextProps) {
  return <p className={variants[variant]}>{children}</p>
}
