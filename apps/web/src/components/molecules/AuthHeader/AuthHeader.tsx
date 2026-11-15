import { Heading } from '../../atoms/Heading/Heading'
import { Text } from '../../atoms/Text/Text'

interface AuthHeaderProps {
  title: string
  subtitle: string
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <Heading level={1}>{title}</Heading>
      <Text>{subtitle}</Text>
    </header>
  )
}
