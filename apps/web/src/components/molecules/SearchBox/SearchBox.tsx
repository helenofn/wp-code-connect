import { useId } from 'react'
import { Icon } from '../../atoms/Icon/Icon'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

/** Campo de busca do Figma: ícone de lupa + texto grande, fundo cinza escuro. */
export function SearchBox({
  value,
  onChange,
  label = 'Buscar posts',
  placeholder = 'Digite o que você procura',
}: SearchBoxProps) {
  const id = useId()
  return (
    <form
      role="search"
      onSubmit={(e) => e.preventDefault()}
      className="flex items-center gap-4 rounded bg-cinza-escuro px-4 py-2 text-cinza-claro focus-within:outline-2 focus-within:outline-verde-destaque"
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Icon name="search" className="size-6 shrink-0 sm:size-8" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-lg/normal text-cinza-claro placeholder:text-cinza-claro focus:outline-none sm:text-2xl/normal"
      />
    </form>
  )
}
