import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { FeedTabs, type FeedTab } from './FeedTabs'

function Controlled({ onChange }: { onChange: (tab: FeedTab) => void }) {
  const [value, setValue] = useState<FeedTab>('recentes')
  return (
    <FeedTabs
      value={value}
      panelId="posts"
      onChange={(tab) => {
        setValue(tab)
        onChange(tab)
      }}
    />
  )
}

describe('FeedTabs', () => {
  it('selects Recentes by default and switches on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)

    expect(screen.getByRole('tab', { name: 'Recentes' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('tab', { name: 'Populares' }))
    expect(onChange).toHaveBeenCalledWith('populares')
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute('aria-selected', 'true')
  })

  it('moves between tabs with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Controlled onChange={vi.fn()} />)

    screen.getByRole('tab', { name: 'Recentes' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveFocus()
    expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute('aria-selected', 'true')
  })
})
