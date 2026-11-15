/**
 * Logo "code connect" montado com os três grupos vetoriais exportados do Figma.
 * Cada SVG mantém seu tamanho nativo (width/height explícitos evitam CLS);
 * só a posição é definida aqui.
 */
export function Logo() {
  return (
    <div role="img" aria-label="Code Connect" className="relative h-10 w-32 overflow-hidden">
      <img src="/logo/logo-1.svg" alt="" width={15} height={23} className="absolute top-3.5 left-0" />
      <img src="/logo/logo-2.svg" alt="" width={15} height={23} className="absolute top-1.5 left-3" />
      <img src="/logo/logo-3.svg" alt="" width={93} height={40} className="absolute top-0 left-8.5" />
    </div>
  )
}
