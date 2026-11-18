import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { Alert } from '../components/atoms/Alert/Alert'
import { Text } from '../components/atoms/Text/Text'
import { WelcomeCard } from '../components/organisms/WelcomeCard/WelcomeCard'
import { getMe, type UserResponse } from '../services/api/auth'
import { getErrorMessage, getErrorStatus } from '../services/api/errors'
import { clearToken, getToken } from '../services/api/tokenStorage'

export function HomePage() {
  const navigate = useNavigate()
  const [hasToken] = useState(() => getToken() !== null)
  const [user, setUser] = useState<UserResponse>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!hasToken) return
    const controller = new AbortController()
    getMe(controller.signal)
      .then(setUser)
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        // Token expirado ou inválido: volta para o login.
        if (getErrorStatus(err) === 401) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }
        setError(getErrorMessage(err))
      })
    return () => controller.abort()
  }, [hasToken, navigate])

  function handleSignOut() {
    clearToken()
    navigate('/login')
  }

  if (!hasToken) {
    return <Navigate to="/login" replace />
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-grafite p-4 sm:p-8">
      <title>Início | Code Connect</title>
      {user ? (
        <WelcomeCard name={user.name} email={user.email} onSignOut={handleSignOut} />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <Text variant="body">Carregando...</Text>
      )}
    </main>
  )
}
