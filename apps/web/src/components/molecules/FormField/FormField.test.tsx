import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from './FormField'

describe('FormField', () => {
  it('links its label to the input and accepts typing', async () => {
    const user = userEvent.setup()
    render(<FormField label="Senha" type="password" />)
    const input = screen.getByLabelText('Senha')
    await user.type(input, 'abc123')
    expect(input).toHaveValue('abc123')
  })
})
