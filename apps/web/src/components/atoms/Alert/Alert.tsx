import type { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
}

/** Mensagem de erro anunciada por leitores de tela assim que aparece. */
export function Alert({ children }: AlertProps) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-cinza-medio px-4 py-3 text-base/normal text-offwhite"
    >
      {children}
    </p>
  )
}
