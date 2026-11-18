import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { getMe } from '../services/api/auth'
import { clearToken, getToken, saveToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { HomePage } from './HomePage'

vi.mock('../services/api/auth')

const ana = {
  id: '1',
  name: 'Ana Souza',
  email: 'ana@example.com',
  createdAt: '2026-11-17T00:00:00.000Z',
}

function renderPage() {
  render(
    <MemoryRouter initialEntries={['/inicio']}>
      <Routes>
        <Route path="/inicio" element={<HomePage />} />
        <Route path="/login" element={<p>Tela de login</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('greets the signed-in user', async () => {
    saveToken('jwt', false)
    vi.mocked(getMe).mockResolvedValue(ana)
    renderPage()

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Olá, Ana Souza' }),
    ).toBeInTheDocument()
    expect(document.title).toBe('Início | Code Connect')
  })

  it('redirects to login without a token', () => {
    renderPage()
    expect(screen.getByText('Tela de login')).toBeInTheDocument()
    expect(getMe).not.toHaveBeenCalled()
  })

  it('clears an expired token and redirects to login', async () => {
    saveToken('expired', true)
    vi.mocked(getMe).mockRejectedValue(httpError(401))
    renderPage()

    expect(await screen.findByText('Tela de login')).toBeInTheDocument()
    expect(getToken()).toBeNull()
  })

  it('signs out', async () => {
    const user = userEvent.setup()
    saveToken('jwt', false)
    vi.mocked(getMe).mockResolvedValue(ana)
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Sair' }))

    expect(screen.getByText('Tela de login')).toBeInTheDocument()
    expect(getToken()).toBeNull()
  })
})
