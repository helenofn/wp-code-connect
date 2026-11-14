import { AuthFooterCta } from '../components/organisms/AuthFooterCta/AuthFooterCta'
import { LoginForm, type LoginValues } from '../components/organisms/LoginForm/LoginForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout'

export function LoginPage() {
  // Integração com a API ainda não existe: o envio apenas registra os dados.
  function handleLogin(values: LoginValues) {
    console.info('login', values)
  }

  return (
    <AuthLayout bannerSrc="/banner-login.png" bannerAlt="Code Connect">
      <LoginForm onSubmit={handleLogin} />
      <SocialLogin
        providers={[
          { name: 'Github', icon: '/github.png', onClick: () => console.info('github login') },
          { name: 'Gmail', icon: '/gmail.png', onClick: () => console.info('gmail login') },
        ]}
      />
      <AuthFooterCta
        question="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        to="/cadastro"
      />
    </AuthLayout>
  )
}
