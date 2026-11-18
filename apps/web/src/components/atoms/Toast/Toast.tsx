interface ToastProps {
  /** Mensagem a anunciar; vazio esconde o aviso, mas mantém a região viva. */
  message?: string
}

/**
 * Aviso rápido (ex.: "Link copiado!"). A região `status` fica sempre no DOM
 * para os leitores de tela anunciarem cada nova mensagem.
 */
export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-32 z-20 flex justify-center px-4 lg:bottom-8"
    >
      {message && (
        <p className="rounded-lg bg-verde-destaque px-4 py-2 text-base/normal font-semibold text-verde-petroleo shadow-editor">
          {message}
        </p>
      )}
    </div>
  )
}
