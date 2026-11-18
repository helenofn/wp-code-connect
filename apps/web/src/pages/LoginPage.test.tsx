import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { login } from '../services/api/auth'
import { clearToken, getToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { LoginPage } from './LoginPage'

vi.mock('../services/api/auth')

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inicio" element={<p>Página inicial</p>} />
      </Routes>
    </MemoryRouter>,
  )
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

  it('signs in, saves the token and goes to the home page', async () => {
    vi.mocked(login).mockResolvedValue({ accessToken: 'jwt', tokenType: 'Bearer', expiresIn: 3600 })
    renderPage()

    await submit('ana@example.com', 'segredo123')

    expect(login).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'segredo123' })
    expect(await screen.findByText('Página inicial')).toBeInTheDocument()
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
