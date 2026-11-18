import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { FeedFilters } from './FeedFilters'

function renderFilters(props: Partial<ComponentProps<typeof FeedFilters>> = {}) {
  const handlers = {
    onQueryChange: vi.fn(),
    onRemoveTag: vi.fn(),
    onAddTag: vi.fn(),
    onClear: vi.fn(),
  }
  render(<FeedFilters query="" tags={[]} {...handlers} {...props} />)
  return handlers
}

describe('FeedFilters', () => {
  it('renders only the search box without filters', () => {
    renderFilters()
    expect(screen.getByRole('searchbox', { name: 'Buscar posts' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Limpar tudo' })).not.toBeInTheDocument()
  })

  it('removes active tags, adds suggested ones and clears everything', async () => {
    const user = userEvent.setup()
    const handlers = renderFilters({ tags: ['front-end'], suggestedTags: ['react'] })

    await user.click(screen.getByRole('button', { name: 'Remover filtro front-end' }))
    expect(handlers.onRemoveTag).toHaveBeenCalledWith('front-end')

    await user.click(screen.getByRole('button', { name: 'Filtrar por react' }))
    expect(handlers.onAddTag).toHaveBeenCalledWith('react')

    await user.click(screen.getByRole('button', { name: 'Limpar tudo' }))
    expect(handlers.onClear).toHaveBeenCalledTimes(1)
  })

  it('reports typed search text', async () => {
    const user = userEvent.setup()
    const handlers = renderFilters()
    await user.type(screen.getByRole('searchbox'), 'r')
    expect(handlers.onQueryChange).toHaveBeenCalledWith('r')
  })
})
