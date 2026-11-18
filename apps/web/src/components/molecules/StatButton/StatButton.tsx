import { Link } from 'react-router'
import { Icon, type IconName } from '../../atoms/Icon/Icon'

interface StatButtonProps {
  icon: IconName
  /** Nome acessível completo (ex.: "Curtir. 12 curtidas"). */
  label: string
  count?: number
  /** Ação do botão. Sem `onClick` nem `to`, vira só um indicador estático. */
  onClick?: () => void
  to?: string
  /** Estado de alternância (ex.: já curtido): destaca em verde. */
  pressed?: boolean
}

const base = 'flex flex-col items-center text-cinza-medio'
const interactive =
  'rounded transition hover:text-offwhite focus-visible:outline-2 focus-visible:outline-verde-destaque'

/** Ícone + contador do rodapé dos cards (curtir, compartilhar, comentar). */
export function StatButton({ icon, label, count, onClick, to, pressed }: StatButtonProps) {
  const content = (
    <>
      <Icon name={icon} className="size-6" />
      {count !== undefined && <span className="text-base/normal">{count}</span>}
    </>
  )
  const color = pressed ? 'text-verde-destaque' : ''

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
        className={`${base} ${interactive} ${color}`}
      >
        {content}
      </button>
    )
  }
  if (to) {
    return (
      <Link to={to} aria-label={label} className={`${base} ${interactive}`}>
        {content}
      </Link>
    )
  }
  return (
    <span className={`${base} ${color}`}>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true" className="flex flex-col items-center">
        {content}
      </span>
    </span>
  )
}
