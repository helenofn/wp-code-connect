import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  it('renders the title and the signup fields', () => {
    render(<SignupForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('submits the typed values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<SignupForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: 'segredo',
      remember: true,
    })
  })

  it('disables the button while submitting', () => {
    render(<SignupForm onSubmit={vi.fn()} submitting />)
    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeDisabled()
  })

  it('shows the error message', () => {
    render(<SignupForm onSubmit={vi.fn()} error="Este email já está cadastrado." />)
    expect(screen.getByRole('alert')).toHaveTextContent('Este email já está cadastrado.')
  })
})
