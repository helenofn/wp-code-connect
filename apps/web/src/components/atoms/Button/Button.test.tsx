import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders the outline variant as a regular button', () => {
    render(<Button variant="outline">Descartar</Button>)
    expect(screen.getByRole('button', { name: 'Descartar' })).toHaveAttribute('type', 'button')
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Login</Button>)
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
