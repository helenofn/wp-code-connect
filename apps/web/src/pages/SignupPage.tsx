import { useState } from 'react'
import { useNavigate } from 'react-router'
import { AuthFooterCta } from '../components/organisms/AuthFooterCta/AuthFooterCta'
import { SignupForm, type SignupValues } from '../components/organisms/SignupForm/SignupForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout'
import { createUser, login } from '../services/api/auth'
import { getErrorMessage } from '../services/api/errors'
import { saveToken } from '../services/api/tokenStorage'
import { socialProviders } from './socialProviders'

export function SignupPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  async function handleSignup({ name, email, password, remember }: SignupValues) {
    setSubmitting(true)
    setError(undefined)
    try {
      await createUser({ name, email, password })
      // Cadastro feito: entra direto, sem pedir os dados de novo.
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
      bannerSrc="/banners/cadastro.webp"
      bannerAlt="Pessoa de óculos em frente a telas com código"
      bannerPosition="object-[60%_center]"
      footer={
        <AuthFooterCta
          question="Já tem conta?"
          linkLabel="Faça seu login!"
          to="/login"
          icon="login"
          layout="inline"
        />
      }
    >
      <title>Cadastro | Code Connect</title>
      <SignupForm onSubmit={handleSignup} submitting={submitting} error={error} />
      <SocialLogin providers={socialProviders} />
    </AuthLayout>
  )
}
