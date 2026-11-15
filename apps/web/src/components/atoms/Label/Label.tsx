import type { ReactNode } from 'react'

interface LabelProps {
  htmlFor: string
  children: ReactNode
}

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="block text-lg/normal text-offwhite">
      {children}
    </label>
  )
}
