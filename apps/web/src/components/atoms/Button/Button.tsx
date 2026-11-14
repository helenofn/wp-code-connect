import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary'
  icon?: ReactNode
  children: ReactNode
}

const variants = {
  primary: 'bg-primary text-ink hover:brightness-95',
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
      className={`flex h-14 w-full items-center justify-center gap-3 rounded-lg text-lg font-semibold transition disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon}
    </button>
  )
}
