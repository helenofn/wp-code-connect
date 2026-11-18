export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

/**
 * Compartilha o link do post: usa o menu nativo do sistema quando existe
 * (celular) e, senão, copia o link para a área de transferência.
 */
export async function sharePost(post: { id: string; title: string }): Promise<ShareResult> {
  const url = new URL(`/posts/${post.id}`, window.location.origin).href
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: post.title, url })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
    }
  }
  try {
    await navigator.clipboard.writeText(url)
    return 'copied'
  } catch {
    return 'failed'
  }
}

export const shareMessages: Record<ShareResult, string | undefined> = {
  shared: undefined,
  cancelled: undefined,
  copied: 'Link copiado!',
  failed: 'Não foi possível copiar o link.',
}
