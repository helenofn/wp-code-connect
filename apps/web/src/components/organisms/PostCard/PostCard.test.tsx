import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { MemoryRouter } from 'react-router'
import { aPost } from '../../../test/fixtures'
import { PostCard } from './PostCard'

function renderCard(props: Partial<ComponentProps<typeof PostCard>> = {}) {
  render(
    <MemoryRouter>
      <PostCard post={aPost()} {...props} />
    </MemoryRouter>,
  )
}

describe('PostCard', () => {
  it('renders a feed card linking to the post', () => {
    renderCard()
    expect(screen.getByRole('heading', { level: 2, name: 'React zero to hero' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'React zero to hero' })).toHaveAttribute('href', '/posts/p1')
    // No feed a imagem repete o link do título e fica escondida dos leitores de tela.
    expect(screen.getByRole('img', { name: 'React zero to hero', hidden: true })).toBeInTheDocument()
    expect(screen.getByText('@julio')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '3 comentários' })).toHaveAttribute(
      'href',
      '/posts/p1#comentarios',
    )
  })

  it('shows likes as a plain counter for visitors', () => {
    renderCard()
    expect(screen.queryByRole('button', { name: /Curtir/ })).not.toBeInTheDocument()
    expect(screen.getByText('12 curtidas')).toBeInTheDocument()
  })

  it('lets signed-in users toggle the like', async () => {
    const user = userEvent.setup()
    const onToggleLike = vi.fn()
    renderCard({ post: aPost({ likedByMe: true }), onToggleLike })

    const like = screen.getByRole('button', { name: 'Descurtir. 12 curtidas' })
    expect(like).toHaveAttribute('aria-pressed', 'true')
    await user.click(like)
    expect(onToggleLike).toHaveBeenCalledTimes(1)
  })

  it('shares and filters by tag', async () => {
    const user = userEvent.setup()
    const onShare = vi.fn()
    const onTagClick = vi.fn()
    renderCard({ onShare, onTagClick })

    await user.click(screen.getByRole('button', { name: 'Compartilhar' }))
    expect(onShare).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole('button', { name: 'Filtrar por react' }))
    expect(onTagClick).toHaveBeenCalledWith('react')
  })

  it('uses the post title as the page heading in the details variant', () => {
    renderCard({ variant: 'details', post: aPost({ thumbnailUrl: null }) })
    expect(screen.getByRole('heading', { level: 1, name: 'React zero to hero' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'React zero to hero (sem imagem)' })).toBeInTheDocument()
  })
})
