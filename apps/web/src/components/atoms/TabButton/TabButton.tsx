import type { ReactNode } from 'react'

interface TabButtonProps {
  selected: boolean
  onSelect: () => void
  /** id do painel que a aba controla. */
  controls?: string
  children: ReactNode
}

/** Aba do Figma: ativa em verde sublinhado, inativa em cinza. */
export function TabButton({ selected, onSelect, controls, children }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={`px-1 text-2xl/normal transition focus-visible:outline-2 focus-visible:outline-verde-destaque ${
        selected ? 'font-semibold text-verde-destaque underline' : 'text-cinza-medio hover:text-offwhite'
      }`}
    >
      {children}
    </button>
  )
}
