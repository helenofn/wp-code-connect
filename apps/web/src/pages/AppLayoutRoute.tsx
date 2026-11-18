import { Outlet } from 'react-router'
import { AppLayout } from '../components/templates/AppLayout/AppLayout'
import { useSession } from '../session/SessionContext'

/**
 * Rota de layout do Feed, Detalhes e Publicar: o menu fica montado entre as
 * telas e só o conteúdo (`Outlet`) troca. O item Login/Sair segue a sessão.
 */
export function AppLayoutRoute() {
  const { status, signOut } = useSession()
  return (
    <AppLayout isAuthenticated={status === 'authenticated'} onSignOut={signOut}>
      <Outlet />
    </AppLayout>
  )
}
