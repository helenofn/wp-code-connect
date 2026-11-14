import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders the text as a level 1 heading', () => {
    render(<Heading level={1}>Login</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
  })

  it('renders a level 2 heading by default', () => {
    render(<Heading>Cadastro</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: 'Cadastro' })).toBeInTheDocument()
  })
})
