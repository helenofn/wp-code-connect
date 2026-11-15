import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders its children as a paragraph', () => {
    render(<Text>Boas-vindas! Faça seu login.</Text>)
    expect(screen.getByText('Boas-vindas! Faça seu login.').tagName).toBe('P')
  })

  it('applies the small variant', () => {
    render(<Text variant="small">Ainda não tem conta?</Text>)
    expect(screen.getByText('Ainda não tem conta?')).toHaveClass('text-base/normal')
  })
})
