import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { SocialLoginButton } from './SocialLoginButton'

describe('SocialLoginButton', () => {
  it('renders the provider logo as an accessible button with a sized icon', () => {
    render(<SocialLoginButton name="Github" icon="/github.svg" iconWidth={33} iconHeight={32} />)
    const button = screen.getByRole('button', { name: 'Github' })
    expect(button).toBeInTheDocument()
    // O ícone é decorativo (alt=""), então fica fora da árvore de acessibilidade.
    const icon = screen.getByRole('presentation', { hidden: true })
    expect(icon).toHaveAttribute('width', '33')
    expect(icon).toHaveAttribute('height', '32')
  })

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <SocialLoginButton
        name="Gmail"
        icon="/gmail.svg"
        iconWidth={28}
        iconHeight={28}
        onClick={onClick}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
