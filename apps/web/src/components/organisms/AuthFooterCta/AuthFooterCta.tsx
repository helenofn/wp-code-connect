import { Icon } from '../../atoms/Icon/Icon'
import { Link } from '../../atoms/Link/Link'
import { Text } from '../../atoms/Text/Text'

interface AuthFooterCtaProps {
  question: string
  linkLabel: string
  to: string
}

export function AuthFooterCta({ question, linkLabel, to }: AuthFooterCtaProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <Text>{question}</Text>
      <div className="flex items-center gap-2 text-lg">
        <Link to={to} variant="accent">
          {linkLabel}
        </Link>
        <Icon name="clipboard" className="size-5 text-primary" />
      </div>
    </div>
  )
}
