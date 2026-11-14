export type IconName = 'arrow-right' | 'clipboard'

interface IconProps {
  name: IconName
  className?: string
}

const paths: Record<IconName, string[]> = {
  'arrow-right': ['M5 12h14', 'M13 6l6 6-6 6'],
  clipboard: [
    'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z',
    'M8 6H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2',
    'M9 13h6',
    'M9 17h6',
  ],
}

export function Icon({ name, className = 'size-5' }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
