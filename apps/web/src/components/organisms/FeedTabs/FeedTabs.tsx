import type { KeyboardEvent } from 'react'
import { TabButton } from '../../atoms/TabButton/TabButton'

export type FeedTab = 'recentes' | 'populares'

const tabs: { value: FeedTab; label: string }[] = [
  { value: 'recentes', label: 'Recentes' },
  { value: 'populares', label: 'Populares' },
]

interface FeedTabsProps {
  value: FeedTab
  onChange: (tab: FeedTab) => void
  /** id da lista de posts que as abas controlam. */
  panelId: string
}

/** Abas Recentes/Populares. As setas do teclado trocam de aba (padrão ARIA). */
export function FeedTabs({ value, onChange, panelId }: FeedTabsProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const index = tabs.findIndex((tab) => tab.value === value)
    const step = event.key === 'ArrowRight' ? 1 : -1
    const next = tabs[(index + step + tabs.length) % tabs.length]!
    onChange(next.value)
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-tab="${next.value}"] button`)?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="Ordenar posts"
      onKeyDown={handleKeyDown}
      className="flex items-start justify-center gap-6"
    >
      {tabs.map((tab) => (
        <span key={tab.value} data-tab={tab.value} className="contents">
          <TabButton
            selected={tab.value === value}
            onSelect={() => onChange(tab.value)}
            controls={panelId}
          >
            {tab.label}
          </TabButton>
        </span>
      ))}
    </div>
  )
}
