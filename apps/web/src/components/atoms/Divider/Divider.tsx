import type { ReactNode } from 'react'

interface DividerProps {
  children?: ReactNode
}

export function Divider({ children }: DividerProps) {
  return (
    <div role="separator" className="flex items-center gap-4">
      <span className="h-px flex-1 bg-offwhite/80" />
      {children && <span className="text-base text-offwhite">{children}</span>}
      <span className="h-px flex-1 bg-offwhite/80" />
    </div>
  )
}
