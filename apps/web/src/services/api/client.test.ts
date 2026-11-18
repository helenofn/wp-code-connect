import type { InternalAxiosRequestConfig } from 'axios'
import { api } from './client'
import { clearToken, saveToken } from './tokenStorage'

function captureRequest() {
  const adapter = vi.fn(async (config: InternalAxiosRequestConfig) => ({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  }))
  api.defaults.adapter = adapter
  return adapter
}

describe('api client', () => {
  afterEach(() => clearToken())

  it('sends the saved token as a Bearer header', async () => {
    const adapter = captureRequest()
    saveToken('jwt-123', false)

    await api.get('/auth/me')

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe('Bearer jwt-123')
  })

  it('sends no Authorization header without a token', async () => {
    const adapter = captureRequest()

    await api.get('/auth/me')

    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined()
  })
})
