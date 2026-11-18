import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { NavItem } from './NavItem'

describe('NavItem', () => {
  it('marks the link of the current route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavItem icon="feed" label="Feed" to="/" />
        <NavItem icon="login" label="Login" to="/login" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Feed' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Login' })).not.toHaveAttribute('aria-current')
  })

  it('runs its action when it is a button', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<NavItem icon="logout" label="Sair" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders a not-yet-available item as plain text', () => {
    render(<NavItem icon="info" label="Sobre nós" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText(/Sobre nós/)).toHaveTextContent('Sobre nós (em breve)')
  })
})
