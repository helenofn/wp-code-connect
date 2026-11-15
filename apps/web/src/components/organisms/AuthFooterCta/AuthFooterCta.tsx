import { Icon, type IconName } from '../../atoms/Icon/Icon'
import { Link } from '../../atoms/Link/Link'
import { Text } from '../../atoms/Text/Text'

interface AuthFooterCtaProps {
  question: string
  linkLabel: string
  to: string
  icon: IconName
  /** `stacked`: pergunta acima do link, centralizados (Login). `inline`: tudo na mesma linha (Cadastro). */
  layout?: 'stacked' | 'inline'
}

const layouts = {
  stacked: 'flex-col justify-center text-center',
  inline: 'flex-row flex-wrap',
}

export function AuthFooterCta({
  question,
  linkLabel,
  to,
  icon,
  layout = 'stacked',
}: AuthFooterCtaProps) {
  return (
    <div className={`flex items-center gap-2 ${layouts[layout]}`}>
      <Text variant={layout === 'stacked' ? 'small' : 'body'}>{question}</Text>
      <Link to={to} variant="accent">
        {linkLabel}
        <Icon name={icon} />
      </Link>
    </div>
  )
}
