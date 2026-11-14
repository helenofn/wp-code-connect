import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Heading } from '../../atoms/Heading/Heading'
import { Icon } from '../../atoms/Icon/Icon'
import { Text } from '../../atoms/Text/Text'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberForgotRow } from '../../molecules/RememberForgotRow/RememberForgotRow'

export interface LoginValues {
  identifier: string
  password: string
  remember: boolean
}

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ identifier, password, remember })
  }

  return (
    <div className="flex flex-col gap-6">
      <Heading level={1}>Login</Heading>
      <Text>Boas-vindas! Faça seu login.</Text>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          label="Email ou usuário"
          name="identifier"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <FormField
          label="Senha"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <RememberForgotRow checked={remember} onCheckedChange={setRemember} />
        <Button type="submit" icon={<Icon name="arrow-right" />}>
          Login
        </Button>
      </form>
    </div>
  )
}
