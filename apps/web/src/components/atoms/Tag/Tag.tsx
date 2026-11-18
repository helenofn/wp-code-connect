import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  /** Com `onClick`, a tag vira um botão (ex.: filtrar o feed por ela). */
  onClick?: () => void
  /** Rótulo acessível do botão, quando o texto sozinho não basta. */
  label?: string
}

const base = 'inline-flex items-center rounded bg-cinza-claro px-2 py-1 text-lg/normal text-cinza-escuro'

export function Tag({ children, onClick, label }: TagProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={`${base} transition hover:bg-offwhite focus-visible:outline-2 focus-visible:outline-verde-destaque`}
      >
        {children}
      </button>
    )
  }
  return <span className={base}>{children}</span>
}
