import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  it('renders the menu for the session and the page content in main', () => {
    render(
      <MemoryRouter>
        <AppLayout isAuthenticated={false} onSignOut={vi.fn()}>
          <p>Conteúdo</p>
        </AppLayout>
      </MemoryRouter>,
    )
    expect(screen.getByRole('main')).toHaveTextContent('Conteúdo')
    expect(screen.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument()
  })
})
