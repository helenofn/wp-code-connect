import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

interface LinkProps {
  to: string
  variant?: 'underline' | 'accent'
  children: ReactNode
}

const variants = {
  underline: 'text-sm text-offwhite underline underline-offset-4',
  accent: 'font-medium text-primary',
}

export function Link({ to, variant = 'underline', children }: LinkProps) {
  return (
    <RouterLink to={to} className={`${variants[variant]} hover:opacity-80`}>
      {children}
    </RouterLink>
  )
}
