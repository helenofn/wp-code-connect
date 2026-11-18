import { createContext, useContext } from 'react'
import type { UserResponse } from '../services/api/auth'

export type SessionStatus = 'loading' | 'authenticated' | 'anonymous'

export interface Session {
  status: SessionStatus
  user?: UserResponse
  /** Guarda o token e carrega o usuário dele. */
  signIn: (token: string, remember: boolean) => Promise<void>
  signOut: () => void
}

export const SessionContext = createContext<Session | null>(null)

export function useSession(): Session {
  const session = useContext(SessionContext)
  if (!session) {
    throw new Error('useSession must be used inside <SessionProvider>')
  }
  return session
}
