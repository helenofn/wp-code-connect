import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { LoginForm } from './LoginForm'

function renderForm(props: Partial<ComponentProps<typeof LoginForm>> = {}) {
  const onSubmit = props.onSubmit ?? vi.fn()
  render(
    <MemoryRouter>
      <LoginForm {...props} onSubmit={onSubmit} />
    </MemoryRouter>,
  )
  return onSubmit
}

describe('LoginForm', () => {
  it('renders the title and the main fields', () => {
    renderForm()
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('submits the typed values', async () => {
    const user = userEvent.setup()
    const onSubmit = renderForm()

    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'ana@example.com',
      password: 'segredo',
      remember: true,
    })
  })

  it('disables the button while submitting', () => {
    renderForm({ submitting: true })
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()
  })

  it('shows the error message', () => {
    renderForm({ error: 'Email ou senha inválidos.' })
    expect(screen.getByRole('alert')).toHaveTextContent('Email ou senha inválidos.')
  })
})
