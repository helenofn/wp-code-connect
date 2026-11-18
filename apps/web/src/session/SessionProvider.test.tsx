import { act, render, screen } from '@testing-library/react'
import { useEffect } from 'react'
import { getMe } from '../services/api/auth'
import { clearToken, getToken, saveToken } from '../services/api/tokenStorage'
import { httpError } from '../test/http'
import { useSession } from './SessionContext'
import { SessionProvider } from './SessionProvider'

vi.mock('../services/api/auth')

const ana = {
  id: '1',
  name: 'Ana Souza',
  email: 'ana@example.com',
  username: 'ana',
  createdAt: '2026-11-17T00:00:00.000Z',
}

let session: ReturnType<typeof useSession>

function Probe() {
  const current = useSession()
  useEffect(() => {
    session = current
  })
  return <p>{current.status}</p>
}

function renderProvider() {
  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  )
}

describe('SessionProvider', () => {
  afterEach(() => {
    vi.resetAllMocks()
    clearToken()
  })

  it('is anonymous without a saved token', () => {
    renderProvider()
    expect(screen.getByText('anonymous')).toBeInTheDocument()
    expect(getMe).not.toHaveBeenCalled()
  })

  it('loads the user of a saved token', async () => {
    saveToken('jwt', false)
    vi.mocked(getMe).mockResolvedValue(ana)
    renderProvider()

    expect(screen.getByText('loading')).toBeInTheDocument()
    expect(await screen.findByText('authenticated')).toBeInTheDocument()
    expect(session.user).toEqual(ana)
  })

  it('drops an expired token', async () => {
    saveToken('expired', false)
    vi.mocked(getMe).mockRejectedValue(httpError(401))
    renderProvider()

    expect(await screen.findByText('anonymous')).toBeInTheDocument()
    expect(getToken()).toBeNull()
  })

  it('signs in and out', async () => {
    vi.mocked(getMe).mockResolvedValue(ana)
    renderProvider()

    await act(() => session.signIn('jwt', true))
    expect(screen.getByText('authenticated')).toBeInTheDocument()
    expect(getToken()).toBe('jwt')

    act(() => session.signOut())
    expect(screen.getByText('anonymous')).toBeInTheDocument()
    expect(getToken()).toBeNull()
  })
})
