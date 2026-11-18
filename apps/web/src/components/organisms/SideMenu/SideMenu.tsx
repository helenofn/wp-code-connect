import { Link as RouterLink } from 'react-router'
import { Link } from '../../atoms/Link/Link'
import { Logo } from '../../atoms/Logo/Logo'
import { NavItem } from '../../molecules/NavItem/NavItem'

interface SideMenuProps {
  isAuthenticated: boolean
  onSignOut: () => void
}

/**
 * "Menu desktop" do Figma: coluna lateral com logo, Publicar e a navegação.
 * Abaixo de `lg` vira um cabeçalho (logo + Publicar) e a navegação desce
 * para uma barra fixa no rodapé ("Menu mobile").
 *
 * O último item depende da sessão: "Login" para visitantes, "Sair" para quem
 * está logado. "Perfil" só aparece logado, como no Figma.
 */
export function SideMenu({ isAuthenticated, onSignOut }: SideMenuProps) {
  return (
    <aside className="flex items-center justify-between lg:w-44 lg:shrink-0 lg:flex-col lg:justify-start lg:gap-20 lg:self-stretch lg:rounded-lg lg:bg-cinza-escuro lg:px-4 lg:py-10">
      <RouterLink
        to="/"
        className="rounded focus-visible:outline-2 focus-visible:outline-verde-destaque"
      >
        <Logo />
      </RouterLink>

      <div className="flex flex-col items-center gap-10 lg:w-full">
        <Link to={isAuthenticated ? '/publicar' : '/login'} variant="outline">
          Publicar
        </Link>

        <nav
          aria-label="Menu principal"
          className="fixed inset-x-4 bottom-4 z-10 rounded-lg bg-cinza-escuro p-2 shadow-editor lg:static lg:w-full lg:bg-transparent lg:p-0 lg:shadow-none"
        >
          <ul className="flex items-center justify-around lg:flex-col lg:gap-10">
            <li>
              <NavItem icon="feed" label="Feed" to="/" />
            </li>
            {isAuthenticated && (
              <li>
                <NavItem icon="account-circle" label="Perfil" />
              </li>
            )}
            <li>
              <NavItem icon="info" label="Sobre nós" />
            </li>
            <li>
              {isAuthenticated ? (
                <NavItem icon="logout" label="Sair" onClick={onSignOut} />
              ) : (
                <NavItem icon="login" label="Login" to="/login" />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
}
