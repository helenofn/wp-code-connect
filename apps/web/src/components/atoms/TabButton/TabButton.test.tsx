import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TabButton } from './TabButton'

describe('TabButton', () => {
  it('exposes its selected state', () => {
    render(
      <TabButton selected onSelect={vi.fn()}>
        Recentes
      </TabButton>,
    )
    expect(screen.getByRole('tab', { name: 'Recentes' })).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <TabButton selected={false} onSelect={onSelect}>
        Populares
      </TabButton>,
    )
    await user.click(screen.getByRole('tab', { name: 'Populares' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
