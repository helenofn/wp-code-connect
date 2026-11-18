import { useState, type FormEvent } from 'react'
import { Alert } from '../../atoms/Alert/Alert'
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { AuthHeader } from '../../molecules/AuthHeader/AuthHeader'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberForgotRow } from '../../molecules/RememberForgotRow/RememberForgotRow'

export interface LoginValues {
  email: string
  password: string
  remember: boolean
}

interface LoginFormProps {
  onSubmit: (values: LoginValues) => void
  /** Enquanto `true`, o botão fica desabilitado e indica o envio. */
  submitting?: boolean
  /** Mensagem de erro do último envio. */
  error?: string
}

export function LoginForm({ onSubmit, submitting = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ email, password, remember })
  }

  return (
    <div className="flex flex-col gap-10">
      <AuthHeader title="Login" subtitle="Boas-vindas! Faça seu login." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        {error && <Alert>{error}</Alert>}
        <Button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          icon={<Icon name="arrow-forward" className="size-4.5" />}
        >
          {submitting ? 'Entrando...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
