import { Button } from '../../atoms/Button/Button'
import { Heading } from '../../atoms/Heading/Heading'
import { Icon } from '../../atoms/Icon/Icon'
import { Text } from '../../atoms/Text/Text'

interface WelcomeCardProps {
  name: string
  email: string
  onSignOut: () => void
}

export function WelcomeCard({ name, email, onSignOut }: WelcomeCardProps) {
  return (
    <section className="flex w-full max-w-120 flex-col gap-8 rounded-4xl bg-cinza-escuro px-6 py-8 sm:px-10">
      <div className="flex flex-col gap-2">
        <Heading level={1}>Olá, {name}</Heading>
        <Text variant="body">{email}</Text>
      </div>
      <Button onClick={onSignOut} icon={<Icon name="logout" className="size-4.5" />}>
        Sair
      </Button>
    </section>
  )
}
