import { AuthFooterCta } from '../components/organisms/AuthFooterCta/AuthFooterCta'
import { SignupForm, type SignupValues } from '../components/organisms/SignupForm/SignupForm'
import { SocialLogin } from '../components/organisms/SocialLogin/SocialLogin'
import { AuthLayout } from '../components/templates/AuthLayout/AuthLayout'
import { socialProviders } from './socialProviders'

export function SignupPage() {
  // Integração com a API ainda não existe: o envio apenas registra os dados.
  function handleSignup(values: SignupValues) {
    console.info('signup', values)
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
      <SignupForm onSubmit={handleSignup} />
      <SocialLogin providers={socialProviders} />
    </AuthLayout>
  )
}
