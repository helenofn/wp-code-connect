import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { SignupPage } from './SignupPage'

describe('SignupPage', () => {
  it('renders the signup screen with its main actions', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    )
    expect(document.title).toBe('Cadastro | Code Connect')
    expect(screen.getByRole('heading', { level: 1, name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Faça seu login!' })).toHaveAttribute('href', '/login')
  })
})
