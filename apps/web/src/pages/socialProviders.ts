import type { SocialProvider } from '../components/organisms/SocialLogin/SocialLogin'

// Login social ainda não integrado: os cliques apenas registram o provedor.
// Largura e altura vêm do viewBox de cada SVG em public/icons.
export const socialProviders: SocialProvider[] = [
  {
    name: 'Github',
    icon: '/icons/github.svg',
    iconWidth: 33,
    iconHeight: 32,
    onClick: () => console.info('github login'),
  },
  {
    name: 'Gmail',
    icon: '/icons/gmail.svg',
    iconWidth: 28,
    iconHeight: 28,
    onClick: () => console.info('gmail login'),
  },
]
