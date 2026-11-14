import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { Checkbox } from './Checkbox'

function Controlled() {
  const [checked, setChecked] = useState(false)
  return (
    <Checkbox
      id="remember"
      label="Lembrar-me"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  )
}

describe('Checkbox', () => {
  it('renders unchecked with its label', () => {
    render(<Checkbox id="remember" label="Lembrar-me" />)
    expect(screen.getByRole('checkbox', { name: 'Lembrar-me' })).not.toBeChecked()
  })

  it('toggles when clicked', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const checkbox = screen.getByRole('checkbox', { name: 'Lembrar-me' })
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })
})
