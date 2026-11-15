import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the brand as a single accessible image', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Code Connect' })).toBeInTheDocument()
  })
})
