import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

interface LinkProps {
  to: string
  variant?: 'underline' | 'accent'
  children: ReactNode
}

const variants = {
  underline: 'text-base/normal text-offwhite underline',
  accent: 'flex items-center gap-3 text-lg/normal text-verde-destaque',
}

export function Link({ to, variant = 'underline', children }: LinkProps) {
  return (
    <RouterLink to={to} className={`${variants[variant]} hover:opacity-80`}>
      {children}
    </RouterLink>
  )
}
