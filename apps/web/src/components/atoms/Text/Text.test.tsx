import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders its children as a paragraph', () => {
    render(<Text>Boas-vindas! Faça seu login.</Text>)
    expect(screen.getByText('Boas-vindas! Faça seu login.').tagName).toBe('P')
  })

  it('applies the muted variant', () => {
    render(<Text variant="muted">Lembrar-me</Text>)
    expect(screen.getByText('Lembrar-me')).toHaveClass('text-muted')
  })
})
