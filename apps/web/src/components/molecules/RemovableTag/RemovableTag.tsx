import { Icon } from '../../atoms/Icon/Icon'

interface RemovableTagProps {
  label: string
  onRemove: () => void
  /** Texto do botão de remover para leitores de tela. */
  removeLabel?: string
}

/** Tag selecionada (filtro ativo ou tag do novo post) com botão de remover. */
export function RemovableTag({ label, onRemove, removeLabel = `Remover ${label}` }: RemovableTagProps) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded bg-cinza-medio px-2 py-1 text-lg/normal text-cinza-escuro">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={removeLabel}
        className="rounded-sm hover:text-offwhite focus-visible:outline-2 focus-visible:outline-verde-destaque"
      >
        <Icon name="close" className="size-4" />
      </button>
    </span>
  )
}
