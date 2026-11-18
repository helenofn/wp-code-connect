import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Link } from './Link'

describe('Link', () => {
  it('renders the outline variant as a link', () => {
    render(
      <MemoryRouter>
        <Link to="/publicar" variant="outline">
          Publicar
        </Link>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Publicar' })).toHaveAttribute('href', '/publicar')
  })

  it('points to the given route', () => {
    render(
      <MemoryRouter>
        <Link to="/cadastro" variant="accent">
          Crie seu cadastro!
        </Link>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })
})
