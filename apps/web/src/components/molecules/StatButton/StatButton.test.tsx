import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { StatButton } from './StatButton'

describe('StatButton', () => {
  it('is a toggle button when it has an action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<StatButton icon="code" label="Curtir. 12 curtidas" count={12} onClick={onClick} pressed={false} />)

    const button = screen.getByRole('button', { name: 'Curtir. 12 curtidas' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveTextContent('12')
    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is a link when it has a destination', () => {
    render(
      <MemoryRouter>
        <StatButton icon="chat" label="3 comentários" count={3} to="/posts/1#comentarios" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: '3 comentários' })).toHaveAttribute(
      'href',
      '/posts/1#comentarios',
    )
  })

  it('is static text without an action', () => {
    render(<StatButton icon="code" label="12 curtidas" count={12} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByText('12 curtidas')).toBeInTheDocument()
  })
})
