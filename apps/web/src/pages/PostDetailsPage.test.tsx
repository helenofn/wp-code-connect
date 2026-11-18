import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getMe } from '../services/api/auth'
import { createComment, listComments } from '../services/api/comments'
import { getPost, unlikePost } from '../services/api/posts'
import { clearToken, saveToken } from '../services/api/tokenStorage'
import { aPost, aThread } from '../test/fixtures'
import { httpError } from '../test/http'
import { ana, renderApp } from '../test/render'
import { PostDetailsPage } from './PostDetailsPage'

vi.mock('../services/api/auth')
vi.mock('../services/api/posts')
vi.mock('../services/api/comments')

function renderPage() {
  renderApp({
    path: '/posts/p1',
    appRoutes: [
      { path: '/posts/:id', element: <PostDetailsPage /> },
      { path: '/', element: <p>Feed</p> },
    ],
  })
}

describe('PostDetailsPage', () => {
  beforeEach(() => {
    vi.mocked(getPost).mockResolvedValue(aPost())
    vi.mocked(listComments).mockResolvedValue([aThread()])
  })

  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('shows the post, its code and the comments to visitors, read-only', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { level: 1, name: 'React zero to hero' })).toBeInTheDocument()
    expect(document.title).toBe('React zero to hero | Code Connect')
    expect(getPost).toHaveBeenCalledWith('p1', expect.any(AbortSignal))
    expect(screen.getByRole('heading', { name: 'Código:' })).toBeInTheDocument()
    expect(screen.getByText(/Quanto tempo você levou/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Curtir/ })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Escreva um comentário')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entre' })).toBeInTheDocument()
  })

  it('shows a not-found message', async () => {
    vi.mocked(getPost).mockRejectedValue(httpError(404))
    renderPage()

    expect(await screen.findByRole('alert')).toHaveTextContent('Post não encontrado.')
    expect(screen.getByRole('link', { name: 'Voltar para o feed' })).toHaveAttribute('href', '/')
  })

  describe('for signed-in users', () => {
    beforeEach(() => {
      saveToken('jwt', false)
      vi.mocked(getMe).mockResolvedValue(ana)
    })

    it('comments and updates the counter', async () => {
      const user = userEvent.setup()
      vi.mocked(createComment).mockResolvedValue({
        id: 'c9',
        postId: 'p1',
        parentId: null,
        body: 'Muito bom!',
        author: { id: ana.id, name: ana.name, username: ana.username },
        createdAt: '2026-11-18T00:00:00.000Z',
      })
      renderPage()

      await user.type(await screen.findByLabelText('Escreva um comentário'), 'Muito bom!')
      await user.click(screen.getByRole('button', { name: 'Comentar' }))

      expect(createComment).toHaveBeenCalledWith('p1', { body: 'Muito bom!', parentId: undefined })
      expect(await screen.findByText('Muito bom!')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: '4 comentários' })).toBeInTheDocument()
    })

    it('replies to a comment', async () => {
      const user = userEvent.setup()
      vi.mocked(createComment).mockResolvedValue({
        id: 'c9',
        postId: 'p1',
        parentId: 'c1',
        body: '@gabriel_luz Uns 3 dias',
        author: { id: ana.id, name: ana.name, username: ana.username },
        createdAt: '2026-11-18T00:00:00.000Z',
      })
      renderPage()

      await user.click(await screen.findByRole('button', { name: 'Responder' }))
      await user.type(screen.getByLabelText('Responder a @gabriel_luz'), 'Uns 3 dias')
      await user.click(screen.getByRole('button', { name: 'Enviar resposta' }))

      expect(createComment).toHaveBeenCalledWith('p1', { body: '@gabriel_luz Uns 3 dias', parentId: 'c1' })
      expect(await screen.findByText('@gabriel_luz Uns 3 dias')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Ocultar respostas' })).toBeInTheDocument()
    })

    it('removes a like', async () => {
      const user = userEvent.setup()
      vi.mocked(getPost).mockResolvedValue(aPost({ likedByMe: true }))
      vi.mocked(unlikePost).mockResolvedValue()
      renderPage()

      await user.click(await screen.findByRole('button', { name: 'Descurtir. 12 curtidas' }))

      expect(unlikePost).toHaveBeenCalledWith('p1')
      expect(screen.getByRole('button', { name: 'Curtir. 11 curtidas' })).toBeInTheDocument()
    })
  })
})
