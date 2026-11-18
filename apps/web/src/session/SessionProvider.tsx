import axios from 'axios'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getMe, type UserResponse } from '../services/api/auth'
import { getErrorStatus } from '../services/api/errors'
import { clearToken, getToken, saveToken } from '../services/api/tokenStorage'
import { SessionContext, type Session, type SessionStatus } from './SessionContext'

interface SessionProviderProps {
  children: ReactNode
}

/**
 * Sessão do usuário para o app todo: começa em `loading` quando há token salvo
 * e confirma com `GET /auth/me`. Um token expirado ou inválido (401) é
 * descartado e a sessão vira anônima.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  const [status, setStatus] = useState<SessionStatus>(() =>
    getToken() ? 'loading' : 'anonymous',
  )
  const [user, setUser] = useState<UserResponse>()

  useEffect(() => {
    if (!getToken()) return
    const controller = new AbortController()
    getMe(controller.signal)
      .then((me) => {
        setUser(me)
        setStatus('authenticated')
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        if (getErrorStatus(err) === 401) clearToken()
        setStatus('anonymous')
      })
    return () => controller.abort()
  }, [])

  const signIn = useCallback(async (token: string, remember: boolean) => {
    saveToken(token, remember)
    const me = await getMe()
    setUser(me)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(() => {
    clearToken()
    setUser(undefined)
    setStatus('anonymous')
  }, [])

  const session = useMemo<Session>(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  )

  return <SessionContext value={session}>{children}</SessionContext>
}
