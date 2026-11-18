import type { ReactNode } from 'react'

interface AlertProps {
  /** `dark` para fundos claros (ex.: a seção de comentários). */
  tone?: 'light' | 'dark'
  children: ReactNode
}

/** Mensagem de erro anunciada por leitores de tela assim que aparece. */
export function Alert({ tone = 'light', children }: AlertProps) {
  const colors =
    tone === 'dark' ? 'border-cinza-escuro text-cinza-escuro' : 'border-cinza-medio text-offwhite'
  return (
    <p role="alert" className={`rounded-lg border px-4 py-3 text-base/normal ${colors}`}>
      {children}
    </p>
  )
}
