import type { ReactNode } from 'react'
import { Logo } from '../../atoms/Logo/Logo'

interface AuthLayoutProps {
  bannerSrc: string
  bannerAlt: string
  /** Classe `object-[x_y]` com o recorte do banner usado no Figma (padrão: centro). */
  bannerPosition?: string
  /** Rodapé do card (ex.: link para a outra tela de autenticação). */
  footer?: ReactNode
  children: ReactNode
}

/**
 * Layout base das telas de Login e Cadastro: card com banner + logo à esquerda
 * e o conteúdo à direita. Só o banner, o conteúdo e o rodapé mudam entre elas.
 */
export function AuthLayout({
  bannerSrc,
  bannerAlt,
  bannerPosition = 'object-center',
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-grafite p-4 sm:p-8">
      <div className="flex w-full max-w-120 flex-col gap-8 rounded-4xl border border-grafite bg-cinza-escuro px-6 py-8 sm:px-10 lg:max-w-5xl lg:flex-row lg:justify-between lg:gap-6 lg:px-20 lg:py-14">
        <div className="relative hidden h-104 overflow-hidden md:block lg:h-auto lg:w-102 lg:shrink-0">
          <img
            src={bannerSrc}
            alt={bannerAlt}
            // Banner é o LCP: baixa com prioridade. Dimensões nativas evitam CLS.
            width={1344}
            height={896}
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 size-full object-cover ${bannerPosition}`}
          />
          <div className="absolute inset-x-0 bottom-8 flex justify-center">
            <Logo />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 lg:w-102 lg:shrink-0 lg:px-8">
          <div className="flex flex-col gap-8">{children}</div>
          {footer}
        </div>
      </div>
    </main>
  )
}
