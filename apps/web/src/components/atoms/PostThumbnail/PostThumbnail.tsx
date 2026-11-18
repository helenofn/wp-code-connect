import { useState } from 'react'
import { Icon } from '../Icon/Icon'

interface PostThumbnailProps {
  /** URL da imagem do post; `null` mostra o placeholder. */
  src: string | null
  alt: string
  /** Imagem acima da dobra (ex.: página de detalhes): baixa com prioridade. */
  priority?: boolean
}

/**
 * Imagem do post no formato do "Code editor" do Figma. Sem imagem, ou quando
 * ela não carrega, mostra um placeholder com o ícone de código no lugar.
 * Ocupa todo o espaço do pai, que define o tamanho.
 */
export function PostThumbnail({ src, alt, priority = false }: PostThumbnailProps) {
  // Guarda a URL que falhou, para uma URL nova tentar carregar de novo.
  const [failedSrc, setFailedSrc] = useState<string>()

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={`${alt} (sem imagem)`}
        className="flex size-full flex-col items-center justify-center gap-2 rounded-lg bg-cinza-escuro text-cinza-medio shadow-editor"
      >
        <Icon name="code" className="size-16" />
        <span aria-hidden="true" className="text-base/normal">
          Sem imagem
        </span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className="size-full rounded-lg object-cover shadow-editor"
    />
  )
}
