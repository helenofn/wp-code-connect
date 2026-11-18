import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'

describe('Tag', () => {
  it('renders static text without a button', () => {
    render(<Tag>react</Tag>)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('becomes a button when clickable', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Tag onClick={onClick} label="Filtrar por react">
        react
      </Tag>,
    )
    await user.click(screen.getByRole('button', { name: 'Filtrar por react' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
