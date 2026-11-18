import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('accepts multi-line text', async () => {
    const user = userEvent.setup()
    render(<Textarea aria-label="Descrição" />)
    const field = screen.getByRole('textbox', { name: 'Descrição' })
    await user.type(field, 'linha 1{enter}linha 2')
    expect(field).toHaveValue('linha 1\nlinha 2')
  })
})
