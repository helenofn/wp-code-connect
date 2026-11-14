import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('accepts typed text', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Senha" type="password" />)
    const input = screen.getByLabelText('Senha')
    await user.type(input, 'segredo')
    expect(input).toHaveValue('segredo')
  })

  it('forwards the type attribute', () => {
    render(<Input aria-label="Senha" type="password" />)
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })
})
