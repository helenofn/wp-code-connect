import type { ReactNode } from 'react'

interface HeadingProps {
  level?: 1 | 2
  children: ReactNode
}

export function Heading({ level = 2, children }: HeadingProps) {
  if (level === 1) {
    return <h1 className="text-3xl/normal font-semibold text-offwhite">{children}</h1>
  }
  return <h2 className="text-2xl/normal font-medium text-offwhite">{children}</h2>
}
