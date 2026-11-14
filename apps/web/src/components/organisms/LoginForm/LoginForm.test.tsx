import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { LoginForm } from './LoginForm'

function renderForm(onSubmit = vi.fn()) {
  render(
    <MemoryRouter>
      <LoginForm onSubmit={onSubmit} />
    </MemoryRouter>,
  )
  return onSubmit
}

describe('LoginForm', () => {
  it('renders the title and the main fields', () => {
    renderForm()
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('submits the typed values', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm()

    await user.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(onSubmit).toHaveBeenCalledWith({
      identifier: 'usuario123',
      password: 'segredo',
      remember: true,
    })
  })
})
