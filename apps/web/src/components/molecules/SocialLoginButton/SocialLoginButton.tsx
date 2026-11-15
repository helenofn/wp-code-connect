interface SocialLoginButtonProps {
  name: string
  icon: string
  /** Dimensões nativas do ícone, para reservar o espaço antes do carregamento (CLS). */
  iconWidth: number
  iconHeight: number
  onClick?: () => void
}

export function SocialLoginButton({
  name,
  icon,
  iconWidth,
  iconHeight,
  onClick,
}: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1 transition hover:opacity-80"
    >
      <img src={icon} alt="" width={iconWidth} height={iconHeight} />
      <span className="text-xs/normal text-offwhite">{name}</span>
    </button>
  )
}
