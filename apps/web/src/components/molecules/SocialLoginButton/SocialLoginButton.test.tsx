import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SocialLoginButton } from './SocialLoginButton'

describe('SocialLoginButton', () => {
  it('renders the provider logo as an accessible button', () => {
    render(<SocialLoginButton name="Github" icon="/github.png" />)
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SocialLoginButton name="Gmail" icon="/gmail.png" onClick={onClick} />)
    await user.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
