import { useId } from 'react'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Link } from '../../atoms/Link/Link'

interface RememberForgotRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  /** Rota de recuperação de senha; sem ela, só o "Lembrar-me" é exibido. */
  forgotPasswordTo?: string
}

export function RememberForgotRow({
  checked,
  onCheckedChange,
  forgotPasswordTo,
}: RememberForgotRowProps) {
  const id = useId()
  return (
    <div className="flex items-center justify-between">
      <Checkbox
        id={id}
        label="Lembrar-me"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      {forgotPasswordTo && <Link to={forgotPasswordTo}>Esqueci a senha</Link>}
    </div>
  )
}
