import { render, screen } from '@testing-library/react'
import { AuthorBadge } from './AuthorBadge'

describe('AuthorBadge', () => {
  it('shows the avatar initials and the @username', () => {
    render(<AuthorBadge name="Julio Cesar" username="julio" />)
    expect(screen.getByText('@julio')).toBeInTheDocument()
    expect(screen.getByText('JC')).toBeInTheDocument()
  })
})
