import { Checkbox } from '../../atoms/Checkbox/Checkbox'
import { Link } from '../../atoms/Link/Link'

interface RememberForgotRowProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  forgotPasswordTo?: string
}

export function RememberForgotRow({
  checked,
  onCheckedChange,
  forgotPasswordTo = '/esqueci-senha',
}: RememberForgotRowProps) {
  return (
    <div className="flex items-center justify-between">
      <Checkbox
        id="remember-me"
        label="Lembrar-me"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
      />
      <Link to={forgotPasswordTo}>Esqueci a senha</Link>
    </div>
  )
}
