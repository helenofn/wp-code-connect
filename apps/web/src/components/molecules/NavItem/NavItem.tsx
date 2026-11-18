import { NavLink } from 'react-router'
import { Icon, type IconName } from '../../atoms/Icon/Icon'

interface NavItemProps {
  icon: IconName
  label: string
  /** Rota do item. Sem `to` nem `onClick`, o item aparece como "em breve". */
  to?: string
  onClick?: () => void
}

const base =
  'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-center text-base/normal whitespace-nowrap transition lg:gap-2 lg:px-4 lg:text-2xl/normal'
const focus = 'focus-visible:outline-2 focus-visible:outline-verde-destaque'
const iconClass = 'size-6 lg:size-8'

/** Item do menu (ícone em cima, rótulo embaixo). O item da rota atual fica em branco. */
export function NavItem({ icon, label, to, onClick }: NavItemProps) {
  if (to) {
    return (
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `${base} ${focus} ${isActive ? 'text-white' : 'text-cinza-medio hover:text-offwhite'}`
        }
      >
        <Icon name={icon} className={iconClass} />
        {label}
      </NavLink>
    )
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${focus} text-cinza-medio hover:text-offwhite`}>
        <Icon name={icon} className={iconClass} />
        {label}
      </button>
    )
  }
  return (
    <span className={`${base} text-cinza-medio`}>
      <Icon name={icon} className={iconClass} />
      <span>
        {label}
        <span className="sr-only"> (em breve)</span>
      </span>
    </span>
  )
}
