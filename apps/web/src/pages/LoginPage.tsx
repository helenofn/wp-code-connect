import { AuthFooterCta } from '../components/organisms/AuthFooterCta/AuthFooterCta'
import { LoginForm, type LoginValues } from '../components/organisms/LoginForm/LoginForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout'
import { socialProviders } from './socialProviders'

export function LoginPage() {
  // Integração com a API ainda não existe: o envio apenas registra os dados.
  function handleLogin(values: LoginValues) {
    console.info('login', values)
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
      <LoginForm onSubmit={handleLogin} />
      <SocialLogin providers={socialProviders} />
    </AuthLayout>
  )
}
