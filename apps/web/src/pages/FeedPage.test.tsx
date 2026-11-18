import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getMe } from '../services/api/auth'
import { likePost, listPosts, type PostPage } from '../services/api/posts'
import { clearToken, saveToken } from '../services/api/tokenStorage'
import { aPost } from '../test/fixtures'
import { httpError } from '../test/http'
import { ana, renderApp } from '../test/render'
import { FeedPage } from './FeedPage'

vi.mock('../services/api/auth')
vi.mock('../services/api/posts')

function pageOf(items = [aPost(), aPost({ id: 'p2', title: 'Acessibilidade na web', tags: ['acessibilidade'], likesCount: 5 })]): PostPage {
  return { items, meta: { page: 1, limit: 12, total: items.length, totalPages: 1 } }
}

function renderFeed(path = '/') {
  renderApp({ path, appRoutes: [{ path: '/', element: <FeedPage /> }] })
}

describe('FeedPage', () => {
  beforeEach(() => {
    vi.mocked(listPosts).mockResolvedValue(pageOf())
  })

  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  describe('for visitors', () => {
    it('lists the posts with likes as plain counters and a Login link', async () => {
      renderFeed()

      expect(await screen.findByRole('heading', { name: 'React zero to hero' })).toBeInTheDocument()
      expect(document.title).toBe('Feed | Code Connect')
      expect(listPosts).toHaveBeenCalledWith(
        { q: '', tags: [], sort: '-createdAt', page: 1, limit: 12 },
        expect.any(AbortSignal),
      )
      expect(screen.queryByRole('button', { name: /Curtir/ })).not.toBeInTheDocument()
      const nav = screen.getByRole('navigation', { name: 'Menu principal' })
      expect(within(nav).getByRole('link', { name: 'Login' })).toBeInTheDocument()
    })

    it('searches on the backend after the user stops typing', async () => {
      const user = userEvent.setup()
      renderFeed()
      await screen.findByRole('heading', { name: 'React zero to hero' })

      await user.type(screen.getByRole('searchbox', { name: 'Buscar posts' }), 'acessib')

      await waitFor(() =>
        expect(listPosts).toHaveBeenLastCalledWith(
          expect.objectContaining({ q: 'acessib' }),
          expect.any(AbortSignal),
        ),
      )
      // Uma busca só, não uma por tecla.
      expect(vi.mocked(listPosts).mock.calls.filter(([params]) => params.q)).toHaveLength(1)
    })

    it('filters by a tag clicked in a card and clears the filters', async () => {
      const user = userEvent.setup()
      renderFeed()
      await screen.findByRole('heading', { name: 'React zero to hero' })

      const card = screen.getByRole('heading', { name: 'Acessibilidade na web' }).closest('article')!
      await user.click(within(card).getByRole('button', { name: 'Filtrar por acessibilidade' }))

      await waitFor(() =>
        expect(listPosts).toHaveBeenLastCalledWith(
          expect.objectContaining({ tags: ['acessibilidade'] }),
          expect.any(AbortSignal),
        ),
      )
      expect(screen.getByRole('button', { name: 'Remover filtro acessibilidade' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Limpar tudo' }))
      await waitFor(() =>
        expect(listPosts).toHaveBeenLastCalledWith(
          expect.objectContaining({ tags: [] }),
          expect.any(AbortSignal),
        ),
      )
    })

    it('sorts by likes on the Populares tab', async () => {
      const user = userEvent.setup()
      renderFeed()
      await screen.findByRole('heading', { name: 'React zero to hero' })

      await user.click(screen.getByRole('tab', { name: 'Populares' }))

      await waitFor(() =>
        expect(listPosts).toHaveBeenLastCalledWith(
          expect.objectContaining({ sort: '-likesCount' }),
          expect.any(AbortSignal),
        ),
      )
    })

    it('reads the filters from the URL', async () => {
      renderFeed('/?q=react&tags=front-end&ordem=populares')
      await screen.findByRole('heading', { name: 'React zero to hero' })

      expect(listPosts).toHaveBeenCalledWith(
        { q: 'react', tags: ['front-end'], sort: '-likesCount', page: 1, limit: 12 },
        expect.any(AbortSignal),
      )
      expect(screen.getByRole('searchbox')).toHaveValue('react')
      expect(screen.getByRole('tab', { name: 'Populares' })).toHaveAttribute('aria-selected', 'true')
    })

    it('shows an empty state', async () => {
      vi.mocked(listPosts).mockResolvedValue(pageOf([]))
      renderFeed()
      expect(await screen.findByText('Nenhum post encontrado.')).toBeInTheDocument()
    })

    it('loads more posts', async () => {
      const user = userEvent.setup()
      vi.mocked(listPosts)
        .mockResolvedValueOnce({ items: [aPost()], meta: { page: 1, limit: 12, total: 2, totalPages: 2 } })
        .mockResolvedValueOnce({
          items: [aPost({ id: 'p2', title: 'CSS Grid' })],
          meta: { page: 2, limit: 12, total: 2, totalPages: 2 },
        })
      renderFeed()

      await user.click(await screen.findByRole('button', { name: 'Carregar mais' }))

      expect(await screen.findByRole('heading', { name: 'CSS Grid' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'React zero to hero' })).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Carregar mais' })).not.toBeInTheDocument()
    })
  })

  describe('for signed-in users', () => {
    beforeEach(() => {
      saveToken('jwt', false)
      vi.mocked(getMe).mockResolvedValue(ana)
    })

    it('likes a post right away and shows Sair in the menu', async () => {
      const user = userEvent.setup()
      vi.mocked(likePost).mockResolvedValue()
      renderFeed()

      await user.click(await screen.findByRole('button', { name: 'Curtir. 12 curtidas' }))

      expect(screen.getByRole('button', { name: 'Descurtir. 13 curtidas' })).toHaveAttribute('aria-pressed', 'true')
      expect(likePost).toHaveBeenCalledWith('p1')
      expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    })

    it('undoes the like when the request fails', async () => {
      const user = userEvent.setup()
      vi.mocked(likePost).mockRejectedValue(httpError(500))
      renderFeed()

      await user.click(await screen.findByRole('button', { name: 'Curtir. 12 curtidas' }))

      expect(await screen.findByRole('button', { name: 'Curtir. 12 curtidas' })).toBeInTheDocument()
      expect(screen.getByRole('status')).toHaveTextContent('Algo deu errado. Tente novamente.')
    })

    it('signs out and goes back to read-only mode', async () => {
      const user = userEvent.setup()
      renderFeed()
      await screen.findByRole('button', { name: 'Curtir. 12 curtidas' })

      await user.click(screen.getByRole('button', { name: 'Sair' }))

      expect(await screen.findByRole('link', { name: 'Login' })).toBeInTheDocument()
      await waitFor(() => expect(screen.queryByRole('button', { name: /Curtir/ })).not.toBeInTheDocument())
    })
  })
})
