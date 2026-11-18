import type { ReactNode } from 'react'
import { SideMenu } from '../../organisms/SideMenu/SideMenu'

interface AppLayoutProps {
  isAuthenticated: boolean
  onSignOut: () => void
  children: ReactNode
}

/**
 * Layout das telas logadas/públicas do app (Feed, Detalhes, Publicar): menu
 * lateral à esquerda e o conteúdo à direita, num container de 1200px. Abaixo
 * de `lg` o menu vira cabeçalho + barra fixa no rodapé, por isso a sobra
 * embaixo (`pb-32`).
 */
export function AppLayout({ isAuthenticated, onSignOut, children }: AppLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-300 flex-col gap-8 px-4 pt-6 pb-32 sm:px-8 lg:flex-row lg:gap-6 lg:py-14">
      <SideMenu isAuthenticated={isAuthenticated} onSignOut={onSignOut} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
