import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'outline-dark'
  icon?: ReactNode
  children: ReactNode
}

const variants = {
  primary: 'bg-verde-destaque text-verde-petroleo hover:brightness-95',
  outline: 'border border-verde-destaque text-verde-destaque hover:bg-verde-destaque/10',
  // Para fundos claros (ex.: a seção de comentários).
  'outline-dark': 'border border-cinza-escuro text-cinza-escuro hover:bg-cinza-escuro/10',
}

export function Button({
  variant = 'primary',
  icon,
  children,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-lg/normal font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  )
}
