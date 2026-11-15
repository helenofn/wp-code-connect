import { useState, type FormEvent } from 'react'
import { Button } from '../../atoms/Button/Button'
import { Icon } from '../../atoms/Icon/Icon'
import { AuthHeader } from '../../molecules/AuthHeader/AuthHeader'
import { FormField } from '../../molecules/FormField/FormField'
import { RememberForgotRow } from '../../molecules/RememberForgotRow/RememberForgotRow'

export interface SignupValues {
  name: string
  email: string
  password: string
  remember: boolean
}

interface SignupFormProps {
  onSubmit: (values: SignupValues) => void
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, email, password, remember })
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
        <Button type="submit" icon={<Icon name="arrow-forward" className="size-4.5" />}>
          Cadastrar
        </Button>
      </form>
    </div>
  )
}
