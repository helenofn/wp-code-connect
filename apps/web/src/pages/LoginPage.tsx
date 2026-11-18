import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthFooterCta } from '../components/organisms/AuthFooterCta/AuthFooterCta'
import { LoginForm, type LoginValues } from '../components/organisms/LoginForm/LoginForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout'
import { login } from '../services/api/auth'
import { getErrorMessage } from '../services/api/errors'
import { saveToken } from '../services/api/tokenStorage'
import { socialProviders } from './socialProviders'

export function LoginPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  async function handleLogin({ email, password, remember }: LoginValues) {
    setSubmitting(true)
    setError(undefined)
    try {
      const { accessToken } = await login({ email, password })
      saveToken(accessToken, remember)
      navigate('/inicio')
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      bannerSrc="/banners/login.webp"
      bannerAlt="Pessoa sorrindo enquanto programa no notebook"
      bannerPosition="object-[51%_center]"
      footer={
        <AuthFooterCta
          question="Ainda não tem conta?"
          linkLabel="Crie seu cadastro!"
          to="/cadastro"
          icon="assignment"
        />
      }
    >
      <title>Login | Code Connect</title>
      <LoginForm onSubmit={handleLogin} submitting={submitting} error={error} />
      <SocialLogin providers={socialProviders} />
    </AuthLayout>
  )
}
