import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RemovableTag } from './RemovableTag'

describe('RemovableTag', () => {
  it('shows the label and removes it on click', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<RemovableTag label="front-end" onRemove={onRemove} removeLabel="Remover filtro front-end" />)

    expect(screen.getByText('front-end')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Remover filtro front-end' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })
})
