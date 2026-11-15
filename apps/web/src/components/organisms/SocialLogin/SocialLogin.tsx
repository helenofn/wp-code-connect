import { Divider } from '../../atoms/Divider/Divider'
import { SocialLoginButton } from '../../molecules/SocialLoginButton/SocialLoginButton'

export interface SocialProvider {
  name: string
  icon: string
  iconWidth: number
  iconHeight: number
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
    <section className="flex flex-col gap-2">
      <Divider>{dividerText}</Divider>
      <div className="flex items-center justify-center gap-6">
        {providers.map((provider) => (
          <SocialLoginButton
            key={provider.name}
            name={provider.name}
            icon={provider.icon}
            iconWidth={provider.iconWidth}
            iconHeight={provider.iconHeight}
            onClick={provider.onClick}
          />
        ))}
      </div>
    </section>
  )
}
