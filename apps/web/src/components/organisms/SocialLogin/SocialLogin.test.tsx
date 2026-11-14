import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SocialLogin } from './SocialLogin'

describe('SocialLogin', () => {
  it('renders the divider text and one button per provider', () => {
    render(
      <SocialLogin
        providers={[
          { name: 'Github', icon: '/github.png' },
          { name: 'Gmail', icon: '/gmail.png' },
        ]}
      />,
    )
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('triggers the provider callback when its button is pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<SocialLogin providers={[{ name: 'Github', icon: '/github.png', onClick }]} />)
    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
