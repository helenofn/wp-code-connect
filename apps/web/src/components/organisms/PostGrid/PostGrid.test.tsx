import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { aPost } from '../../../test/fixtures'
import { PostGrid } from './PostGrid'

describe('PostGrid', () => {
  it('renders one card per post', () => {
    render(
      <MemoryRouter>
        <PostGrid posts={[aPost(), aPost({ id: 'p2', title: 'CSS Grid' })]} />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'CSS Grid' })).toBeInTheDocument()
  })

  it('passes the clicked post to the like handler', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()
    const post = aPost()
    render(
      <MemoryRouter>
        <PostGrid posts={[post]} onToggleLike={onToggleLike} />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Curtir. 12 curtidas' }))
    expect(onToggleLike).toHaveBeenCalledWith(post)
  })

  it('shows an empty state', () => {
    render(<PostGrid posts={[]} />)
    expect(screen.getByText('Nenhum post encontrado.')).toBeInTheDocument()
  })
})
