import { Avatar } from '../../atoms/Avatar/Avatar'

interface AuthorBadgeProps {
  name: string
  username: string
}

/** Componente "Usuário" do Figma: avatar + @username. */
export function AuthorBadge({ name, username }: AuthorBadgeProps) {
  return (
    <span className="flex items-center gap-2" title={name}>
      <Avatar name={name} />
      <span className="text-base/normal font-semibold text-cinza-medio">@{username}</span>
    </span>
  )
}
