import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { createUser, login } from '../services/api/auth'
import { clearToken, getToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { SignupPage } from './SignupPage'

vi.mock('../services/api/auth')

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/cadastro']}>
      <Routes>
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/inicio" element={<p>Página inicial</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

async function submit() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nome'), 'Ana Souza')
  await user.type(screen.getByLabelText('Email'), 'ana@example.com')
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

  it('creates the user, signs in and goes to the home page', async () => {
    vi.mocked(createUser).mockResolvedValue({
      id: '1',
      name: 'Ana Souza',
      email: 'ana@example.com',
      createdAt: '2026-11-17T00:00:00.000Z',
    })
    vi.mocked(login).mockResolvedValue({ accessToken: 'jwt', tokenType: 'Bearer', expiresIn: 3600 })
    renderPage()

    await submit()

    expect(createUser).toHaveBeenCalledWith({
      name: 'Ana Souza',
      email: 'ana@example.com',
      password: 'segredo123',
    })
    expect(login).toHaveBeenCalledWith({ email: 'ana@example.com', password: 'segredo123' })
    expect(await screen.findByText('Página inicial')).toBeInTheDocument()
    expect(getToken()).toBe('jwt')
  })

  it('shows an alert when the email is already registered', async () => {
    vi.mocked(createUser).mockRejectedValue(httpError(409))
    renderPage()

    await submit()

    expect(await screen.findByRole('alert')).toHaveTextContent('Este email já está cadastrado.')
    expect(login).not.toHaveBeenCalled()
  })
})
