import { render } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AppLayoutRoute } from '../pages/AppLayoutRoute'
import { SessionProvider } from '../session/SessionProvider'

export const ana = {
  id: 'u9',
  name: 'Ana Souza',
  email: 'ana@example.com',
  username: 'ana',
  createdAt: '2026-11-17T00:00:00.000Z',
}

/**
 * Renderiza uma tela com a sessão e o roteador de verdade. `appRoutes` ficam
 * dentro do `AppLayoutRoute` (com o menu), como no App.
 */
export function renderApp({
  path,
  appRoutes = [],
  routes = [],
}: {
  path: string
  appRoutes?: { path: string; element: ReactNode }[]
  routes?: { path: string; element: ReactNode }[]
}) {
  return render(
    <SessionProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<AppLayoutRoute />}>
            {appRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
          {routes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </MemoryRouter>
    </SessionProvider>,
  )
}
