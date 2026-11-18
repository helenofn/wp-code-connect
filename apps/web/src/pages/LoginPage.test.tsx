import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getMe, login } from '../services/api/auth'
import { clearToken, getToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { ana, renderApp } from '../test/render'
import { LoginPage } from './LoginPage'

vi.mock('../services/api/auth')

function renderPage() {
  renderApp({
    path: '/login',
    routes: [
      { path: '/login', element: <LoginPage /> },
      { path: '/', element: <p>Feed</p> },
    ],
  })
}

async function submit(email: string, password: string) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Senha'), password)
  await user.click(screen.getByRole('button', { name: 'Login' }))
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('renders the login screen with its main actions', () => {
    renderPage()
    expect(document.title).toBe('Login | Code Connect')
    expect(screen.getByRole('heading', { level: 1, name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('signs in, saves the token and goes to the feed', async () => {
    vi.mocked(login).mockResolvedValue({ accessToken: 'jwt', tokenType: 'Bearer', expiresIn: 3600 })
    vi.mocked(getMe).mockResolvedValue(ana)
    renderPage()

    await submit('ana@example.com', 'segredo123')

    expect(login).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'segredo123' })
    expect(await screen.findByText('Feed')).toBeInTheDocument()
    expect(getToken()).toBe('jwt')
  })

  it('shows an alert when the credentials are wrong', async () => {
    vi.mocked(login).mockRejectedValue(httpError(401))
    renderPage()

    await submit('ana@example.com', 'errada')

    expect(await screen.findByRole('alert')).toHaveTextContent('Email ou senha inválidos.')
    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled()
    expect(getToken()).toBeNull()
  })
})
