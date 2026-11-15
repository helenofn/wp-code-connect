import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { AuthHeader } from '../../molecules/AuthHeader/AuthHeader'
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
    <div className="flex flex-col gap-10">
      <AuthHeader title="Login" subtitle="Boas-vindas! Faça seu login." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <FormField
            label="Email ou usuário"
            name="identifier"
            placeholder="usuario123"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <FormField
              label="Senha"
              name="password"
              type="password"
              placeholder="******"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RememberForgotRow
              checked={remember}
              onCheckedChange={setRemember}
              forgotPasswordTo="/esqueci-senha"
            />
          </div>
        </div>
        <Button type="submit" icon={<Icon name="arrow-forward" className="size-4.5" />}>
          Login
        </Button>
      </form>
    </div>
  )
}
