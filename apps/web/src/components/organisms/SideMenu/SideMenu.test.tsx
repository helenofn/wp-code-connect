import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { SideMenu } from './SideMenu'

function renderMenu(isAuthenticated: boolean, onSignOut = vi.fn()) {
  render(
    <MemoryRouter initialEntries={['/']}>
      <SideMenu isAuthenticated={isAuthenticated} onSignOut={onSignOut} />
    </MemoryRouter>,
  )
  return within(screen.getByRole('navigation', { name: 'Menu principal' }))
}

describe('SideMenu', () => {
  it('offers Login to visitors and sends Publicar to the login page', () => {
    const nav = renderMenu(false)

    expect(nav.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login')
    expect(nav.queryByRole('button', { name: 'Sair' })).not.toBeInTheDocument()
    expect(nav.queryByText(/Perfil/)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Publicar' })).toHaveAttribute('href', '/login')
  })

  it('offers Sair to signed-in users', async () => {
    const user = userEvent.setup()
    const onSignOut = vi.fn()
    const nav = renderMenu(true, onSignOut)

    expect(nav.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
    expect(nav.getByText(/Perfil/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Publicar' })).toHaveAttribute('href', '/publicar')

    await user.click(nav.getByRole('button', { name: 'Sair' }))
    expect(onSignOut).toHaveBeenCalledTimes(1)
  })

  it('links the logo and Feed to the feed', () => {
    const nav = renderMenu(false)
    expect(screen.getByRole('link', { name: 'Code Connect' })).toHaveAttribute('href', '/')
    expect(nav.getByRole('link', { name: 'Feed' })).toHaveAttribute('aria-current', 'page')
  })
})
