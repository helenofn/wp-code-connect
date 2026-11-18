import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

interface LinkProps {
  to: string
  variant?: 'underline' | 'accent' | 'outline' | 'underline-dark'
  children: ReactNode
}

const variants = {
  underline: 'text-base/normal text-offwhite underline',
  // Para fundos claros (ex.: a seção de comentários).
  'underline-dark': 'font-semibold text-cinza-escuro underline',
  accent: 'flex items-center gap-3 text-lg/normal text-verde-destaque',
  // Botão "Publicar" do menu: um link com cara de botão contornado.
  outline:
    'flex items-center justify-center rounded-lg border border-verde-destaque px-4 py-2 text-lg/normal text-verde-destaque lg:w-full lg:py-3 lg:text-2xl/normal',
}

export function Link({ to, variant = 'underline', children }: LinkProps) {
  return (
    <RouterLink to={to} className={`${variants[variant]} hover:opacity-80`}>
      {children}
    </RouterLink>
  )
}
