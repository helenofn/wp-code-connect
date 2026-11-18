import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getMe } from '../services/api/auth'
import { createPost } from '../services/api/posts'
import { clearToken, saveToken } from '../services/api/tokenStorage'
import { aPost } from '../test/fixtures'
import { httpError } from '../test/http'
import { ana, renderApp } from '../test/render'
import { NewPostPage } from './NewPostPage'

vi.mock('../services/api/auth')
vi.mock('../services/api/posts')

function renderPage() {
  renderApp({
    path: '/publicar',
    appRoutes: [
      { path: '/publicar', element: <NewPostPage /> },
      { path: '/posts/:id', element: <p>Página do post</p> },
      { path: '/', element: <p>Página do feed</p> },
    ],
    routes: [{ path: '/login', element: <p>Tela de login</p> }],
  })
}

async function fillAndPublish() {
  const user = userEvent.setup()
  await user.type(await screen.findByLabelText('Nome do projeto'), 'React zero to hero')
  await user.type(screen.getByLabelText('Descrição'), 'Do básico ao avançado')
  await user.type(screen.getByLabelText('URL da imagem (opcional)'), 'https://example.com/a.png')
  await user.type(screen.getByLabelText('Tags'), 'react{enter}')
  await user.click(screen.getByRole('button', { name: 'Publicar' }))
}

describe('NewPostPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('sends visitors to the login page', async () => {
    renderPage()
    expect(await screen.findByText('Tela de login')).toBeInTheDocument()
  })

  describe('for signed-in users', () => {
    beforeEach(() => {
      saveToken('jwt', false)
      vi.mocked(getMe).mockResolvedValue(ana)
    })

    it('publishes the post and opens it', async () => {
      vi.mocked(createPost).mockResolvedValue(aPost({ id: 'novo' }))
      renderPage()

      await fillAndPublish()

      expect(createPost).toHaveBeenCalledWith({
        title: 'React zero to hero',
        description: 'Do básico ao avançado',
        code: undefined,
        thumbnailUrl: 'https://example.com/a.png',
        tags: ['react'],
      })
      expect(await screen.findByText('Página do post')).toBeInTheDocument()
    })

    it('shows the API error and keeps the form', async () => {
      vi.mocked(createPost).mockRejectedValue(httpError(400))
      renderPage()

      await fillAndPublish()

      expect(await screen.findByRole('alert')).toHaveTextContent('Verifique os dados informados.')
      expect(screen.getByLabelText('Nome do projeto')).toHaveValue('React zero to hero')
    })

    it('discards and goes back to the feed', async () => {
      const user = userEvent.setup()
      renderPage()
      await user.click(await screen.findByRole('button', { name: 'Descartar' }))
      expect(await screen.findByText('Página do feed')).toBeInTheDocument()
    })
  })
})
