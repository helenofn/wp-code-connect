import { useState, type FormEvent } from 'react'
import { Alert } from '../../atoms/Alert/Alert'
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { AuthHeader } from '../../molecules/AuthHeader/AuthHeader'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberForgotRow } from '../../molecules/RememberForgotRow/RememberForgotRow'

export interface SignupValues {
  name: string
  email: string
  username: string
  password: string
  remember: boolean
}

interface SignupFormProps {
  onSubmit: (values: SignupValues) => void
  /** Enquanto `true`, o botão fica desabilitado e indica o envio. */
  submitting?: boolean
  /** Mensagem de erro do último envio. */
  error?: string
}

export function SignupForm({ onSubmit, submitting = false, error }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, email, username, password, remember })
  }

  return (
    <div className="flex flex-col gap-8">
      <AuthHeader title="Cadastro" subtitle="Olá! Preencha seus dados." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <FormField
            label="Nome"
            name="name"
            placeholder="Nome completo"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Usuário"
            name="username"
            placeholder="seu_usuario"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            pattern="[A-Za-z0-9_.]{3,30}"
            title="De 3 a 30 caracteres: letras, números, _ ou ."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <FormField
              label="Senha"
              name="password"
              type="password"
              placeholder="******"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <RememberForgotRow checked={remember} onCheckedChange={setRemember} />
          </div>
        </div>
        {error && <Alert>{error}</Alert>}
        <Button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          icon={<Icon name="arrow-forward" className="size-4.5" />}
        >
          {submitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  )
}
