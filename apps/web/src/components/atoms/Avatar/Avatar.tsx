interface AvatarProps {
  name: string
}

/** Iniciais do nome num círculo: placeholder enquanto não há foto de perfil. */
export function Avatar({ name }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('')
  return (
    <span
      aria-hidden="true"
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cinza-claro text-xs/normal font-semibold text-cinza-escuro"
    >
      {initials || '?'}
    </span>
  )
}
