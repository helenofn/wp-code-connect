import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { AuthFooterCta } from './AuthFooterCta'

describe('AuthFooterCta', () => {
  it('shows the question and a link to the target route', () => {
    render(
      <MemoryRouter>
        <AuthFooterCta
          question="Ainda não tem conta?"
          linkLabel="Crie seu cadastro!"
          to="/cadastro"
          icon="assignment"
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Ainda não tem conta?')).toHaveClass('text-base/normal')
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('uses the larger question text in the inline layout', () => {
    render(
      <MemoryRouter>
        <AuthFooterCta
          question="Já tem conta?"
          linkLabel="Faça seu login!"
          to="/login"
          icon="login"
          layout="inline"
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Já tem conta?')).toHaveClass('text-lg/normal')
    expect(screen.getByRole('link', { name: 'Faça seu login!' })).toHaveAttribute('href', '/login')
  })
})
