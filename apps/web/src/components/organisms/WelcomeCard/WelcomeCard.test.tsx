import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeCard } from './WelcomeCard'

describe('WelcomeCard', () => {
  it('greets the user and signs out on click', async () => {
    const user = userEvent.setup()
    const onSignOut = vi.fn()
    render(<WelcomeCard name="Ana Souza" email="ana@example.com" onSignOut={onSignOut} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Olá, Ana Souza' })).toBeInTheDocument()
    expect(screen.getByText('ana@example.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sair' }))
    expect(onSignOut).toHaveBeenCalledOnce()
  })
})
