interface SocialLoginButtonProps {
  name: string
  icon: string
  onClick?: () => void
}

export function SocialLoginButton({ name, icon, onClick }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 transition hover:opacity-80"
    >
      <img src={icon} alt={name} className="size-12 object-contain" />
    </button>
  )
}
