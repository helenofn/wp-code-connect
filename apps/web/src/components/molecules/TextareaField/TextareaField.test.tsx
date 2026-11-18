import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextareaField } from './TextareaField'

describe('TextareaField', () => {
  it('links the label to the textarea', async () => {
    const user = userEvent.setup()
    render(<TextareaField label="Descrição" />)
    const field = screen.getByLabelText('Descrição')
    await user.type(field, 'Um projeto')
    expect(field).toHaveValue('Um projeto')
  })
})
