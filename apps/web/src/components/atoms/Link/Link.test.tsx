import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Link } from './Link'

describe('Link', () => {
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
