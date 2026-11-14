import { Divider } from '../../atoms/Divider/Divider'
import { SocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'

export interface SocialProvider {
  name: string
  icon: string
  onClick?: () => void
}

interface SocialLoginProps {
  providers: SocialProvider[]
  dividerText?: string
}

export function SocialLogin({
  providers,
  dividerText = 'ou entre com outras contas',
}: SocialLoginProps) {
  return (
    <section className="flex flex-col gap-6">
      <Divider>{dividerText}</Divider>
      <div className="flex justify-center gap-10">
        {providers.map((provider) => (
          <SocialLoginButton
            key={provider.name}
            name={provider.name}
            icon={provider.icon}
            onClick={provider.onClick}
          />
        ))}
      </div>
    </section>
  )
}
