import { render, screen } from '@testing-library/react'
import { AuthHeader } from './AuthHeader'

describe('AuthHeader', () => {
  it('renders the title as the page heading and the subtitle', () => {
    render(<AuthHeader title="Cadastro" subtitle="Olá! Preencha seus dados." />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
  })
})
