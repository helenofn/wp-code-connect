import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { vi } from 'vitest'
import { RememberForgotRow } from './RememberForgotRow'

describe('RememberForgotRow', () => {
  it('reports checkbox changes and links to password recovery', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <MemoryRouter>
        <RememberForgotRow checked={false} onCheckedChange={onCheckedChange} />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('checkbox', { name: 'Lembrar-me' }))
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toHaveAttribute(
      'href',
      '/esqueci-senha',
    )
  })
})
