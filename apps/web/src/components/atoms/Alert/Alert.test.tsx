import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders its message as an alert', () => {
    render(<Alert>Email ou senha inválidos.</Alert>)
    expect(screen.getByRole('alert')).toHaveTextContent('Email ou senha inválidos.')
  })
})
