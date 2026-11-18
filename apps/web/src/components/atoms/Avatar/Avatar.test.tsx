import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('shows up to two initials', () => {
    render(<Avatar name="julio cesar da silva" />)
    expect(screen.getByText('JC')).toBeInTheDocument()
  })

  it('is decorative', () => {
    const { container } = render(<Avatar name="Ana" />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
