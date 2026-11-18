import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createUser, getMe, login } from '../services/api/auth'
import { clearToken, getToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { ana, renderApp } from '../test/render'
import { SignupPage } from './SignupPage'

vi.mock('../services/api/auth')

function renderPage() {
  renderApp({
    path: '/cadastro',
    routes: [
      { path: '/cadastro', element: <SignupPage /> },
      { path: '/', element: <p>Feed</p> },
    ],
  })
}

async function submit() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
  await user.type(screen.getByLabelText('Email'), 'ana@example.com')
  await user.type(screen.getByLabelText('Usuário'), 'ana')
  await user.type(screen.getByLabelText('Senha'), 'segredo123')
  await user.click(screen.getByRole('button', { name: 'Cadastrar' }))
}

describe('SignupPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('renders the signup screen with its main actions', () => {
    renderPage()
    expect(document.title).toBe('Cadastro | Code Connect')
    expect(screen.getByRole('heading', { level: 1, name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Faça seu login!' })).toHaveAttribute('href', '/login')
  })

  it('creates the user, signs in and goes to the feed', async () => {
    vi.mocked(createUser).mockResolvedValue(ana)
    vi.mocked(login).mockResolvedValue({ accessToken: 'jwt', tokenType: 'Bearer', expiresIn: 3600 })
    vi.mocked(getMe).mockResolvedValue(ana)
    renderPage()

    await submit()

    expect(createUser).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      username: 'ana',
      password: 'segredo123',
    })
    expect(login).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'segredo123' })
    expect(await screen.findByText('Feed')).toBeInTheDocument()
    expect(getToken()).toBe('jwt')
  })

  it('shows an alert when the email is already registered', async () => {
    vi.mocked(createUser).mockRejectedValue(httpError(409))
    renderPage()

    await submit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Este email já está cadastrado.')
    expect(login).not.toHaveBeenCalled()
  })

  it('shows a specific alert when the username is taken', async () => {
    const error = httpError(409)
    error.response!.data = { message: 'Username already taken' }
    vi.mocked(createUser).mockRejectedValue(error)
    renderPage()

    await submit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Este nome de usuário já está em uso.')
  })
})
