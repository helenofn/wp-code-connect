import { clearToken, getToken, saveToken } from './tokenStorage'

describe('tokenStorage', () => {
  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('keeps the token in localStorage when remember is on', () => {
    saveToken('abc', true)
    expect(localStorage.length).toBe(1)
    expect(sessionStorage.length).toBe(0)
    expect(getToken()).toBe('abc')
  })

  it('keeps the token in sessionStorage when remember is off', () => {
    saveToken('abc', false)
    expect(sessionStorage.length).toBe(1)
    expect(localStorage.length).toBe(0)
    expect(getToken()).toBe('abc')
  })

  it('replaces a previous token and clears both storages', () => {
    saveToken('old', true)
    saveToken('new', false)
    expect(localStorage.length).toBe(0)
    expect(getToken()).toBe('new')

    clearToken()
    expect(getToken()).toBeNull()
  })
})
