import { useId } from 'react'

interface CodeBlockProps {
  code: string
}

/** "card_code_editor" do Figma: título "Código:" e o código em fonte mono. */
export function CodeBlock({ code }: CodeBlockProps) {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-2">
      <h2 id={titleId} className="text-2xl/normal font-semibold text-cinza-medio">
        Código:
      </h2>
      {/* Rolável na horizontal, então precisa receber foco pelo teclado. */}
      <pre
        tabIndex={0}
        aria-labelledby={titleId}
        className="overflow-x-auto rounded-lg bg-cinza-escuro p-4 font-mono text-base text-cinza-claro shadow-editor focus-visible:outline-2 focus-visible:outline-verde-destaque"
      >
        <code>{code}</code>
      </pre>
    </section>
  )
}
