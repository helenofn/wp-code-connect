import axios from 'axios'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Alert } from '../components/atoms/Alert/Alert'
import { Button } from '../components/atoms/Button/Button'
import { Text } from '../components/atoms/Text/Text'
import { Toast } from '../components/atoms/Toast/Toast'
import { FeedFilters } from '../components/organisms/FeedFilters/FeedFilters'
import { FeedTabs, type FeedTab } from '../components/organisms/FeedTabs/FeedTabs'
import { PostGrid } from '../components/organisms/PostGrid/PostGrid'
import { useToast } from '../hooks/useToast'
import { getErrorMessage, getErrorStatus } from '../services/api/errors'
import { listPosts, type PostPage, type PostSummary } from '../services/api/posts'
import { shareMessages, sharePost } from '../services/share'
import { useSession } from '../session/SessionContext'
import { sendLike, withLike } from './likes'

const PAGE_SIZE = 12
const SEARCH_DELAY = 300
const PANEL_ID = 'feed-posts'
const MAX_SUGGESTED_TAGS = 5

function parseTags(value: string | null): string[] {
  return value ? [...new Set(value.split(',').map((t) => t.trim()).filter(Boolean))] : []
}

/** As tags mais frequentes nos posts carregados que ainda não estão no filtro. */
function suggestTags(posts: PostSummary[], active: string[]): string[] {
  const counts = new Map<string, number>()
  for (const tag of posts.flatMap((post) => post.tags)) {
    if (!active.includes(tag)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_SUGGESTED_TAGS)
    .map(([tag]) => tag)
}

/**
 * Feed público. Busca (full-text, no backend), tags e aba ficam na URL
 * (`?q=&tags=&ordem=populares`), então dá para compartilhar uma busca.
 * Só usuários logados curtem.
 */
export function FeedPage() {
  const session = useSession()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const tags = useMemo(() => parseTags(params.get('tags')), [params])
  const tab: FeedTab = params.get('ordem') === 'populares' ? 'populares' : 'recentes'

  const [query, setQuery] = useState(q)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [posts, setPosts] = useState<PostSummary[]>([])
  const [meta, setMeta] = useState<PostPage['meta']>()
  // Chave da busca da última resposta: enquanto difere da atual, está carregando.
  const [loadedKey, setLoadedKey] = useState<string>()
  const [error, setError] = useState<{ key: string; message: string }>()
  const [loadingMore, setLoadingMore] = useState(false)
  const toast = useToast()

  const isAuthenticated = session.status === 'authenticated'
  const tagsKey = tags.join(',')
  const sort = tab === 'populares' ? '-likesCount' : '-createdAt'
  const requestKey = [q, tagsKey, sort, session.status].join('|')
  const status =
    error?.key === requestKey ? 'error' : loadedKey === requestKey ? 'ready' : 'loading'

  useEffect(() => () => clearTimeout(searchTimer.current), [])

  function updateParams(changes: Record<string, string | undefined>) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }
        return next
      },
      { replace: true },
    )
  }

  // A busca digitada só vai para a URL (e para a API) depois de uma pausa na digitação.
  function handleQueryChange(value: string) {
    setQuery(value)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => updateParams({ q: value.trim() || undefined }), SEARCH_DELAY)
  }

  // Recarrega a primeira página quando a busca muda. Espera a sessão para
  // vir com o `likedByMe` certo.
  useEffect(() => {
    if (session.status === 'loading') return
    const key = [q, tagsKey, sort, session.status].join('|')
    const controller = new AbortController()
    listPosts(
      { q, tags: tagsKey ? tagsKey.split(',') : [], sort, page: 1, limit: PAGE_SIZE },
      controller.signal,
    )
      .then((page) => {
        setPosts(page.items)
        setMeta(page.meta)
        setLoadedKey(key)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        setError({ key, message: getErrorMessage(err) })
      })
    return () => controller.abort()
  }, [q, tagsKey, sort, session.status])

  async function loadMore() {
    if (!meta) return
    setLoadingMore(true)
    try {
      const page = await listPosts({ q, tags, sort, page: meta.page + 1, limit: PAGE_SIZE })
      setPosts((current) => {
        const seen = new Set(current.map((post) => post.id))
        return [...current, ...page.items.filter((post) => !seen.has(post.id))]
      })
      setMeta(page.meta)
    } catch (err) {
      toast.show(getErrorMessage(err))
    } finally {
      setLoadingMore(false)
    }
  }

  async function toggleLike(post: PostSummary) {
    const liked = !post.likedByMe
    const update = (value: boolean) =>
      setPosts((current) => current.map((p) => (p.id === post.id ? withLike(p, value) : p)))
    update(liked)
    try {
      await sendLike(post.id, liked)
    } catch (err) {
      update(!liked)
      if (getErrorStatus(err) === 401) {
        session.signOut()
        toast.show('Sua sessão expirou. Entre de novo para curtir.')
      } else {
        toast.show(getErrorMessage(err))
      }
    }
  }

  async function share(post: PostSummary) {
    const message = shareMessages[await sharePost(post)]
    if (message) toast.show(message)
  }

  function addTag(tag: string) {
    if (!tags.includes(tag)) updateParams({ tags: [...tags, tag].join(',') })
  }

  function clearFilters() {
    clearTimeout(searchTimer.current)
    setQuery('')
    updateParams({ q: undefined, tags: undefined })
  }

  const hasMore = meta !== undefined && meta.page < meta.totalPages

  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <title>Feed | Code Connect</title>
      <h1 className="sr-only">Feed de projetos</h1>

      <FeedFilters
        query={query}
        onQueryChange={handleQueryChange}
        tags={tags}
        onRemoveTag={(tag) => updateParams({ tags: tags.filter((t) => t !== tag).join(',') || undefined })}
        suggestedTags={suggestTags(posts, tags)}
        onAddTag={addTag}
        onClear={clearFilters}
      />

      <div className="flex flex-col gap-8">
        <FeedTabs
          value={tab}
          onChange={(next) => updateParams({ ordem: next === 'populares' ? 'populares' : undefined })}
          panelId={PANEL_ID}
        />

        {status === 'error' ? (
          <Alert>{error?.message}</Alert>
        ) : meta === undefined ? (
          <Text variant="body">Carregando posts...</Text>
        ) : (
          // Numa nova busca, os resultados anteriores ficam esmaecidos até chegar a resposta.
          <div
            aria-busy={status === 'loading'}
            className={`flex flex-col gap-8 transition-opacity ${status === 'loading' ? 'opacity-60' : ''}`}
          >
            <PostGrid
              id={PANEL_ID}
              posts={posts}
              onToggleLike={isAuthenticated ? toggleLike : undefined}
              onShare={share}
              onTagClick={addTag}
            />
            {hasMore && (
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
                aria-busy={loadingMore}
                className="self-center sm:w-auto"
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </Button>
            )}
          </div>
        )}
      </div>

      <Toast message={toast.message} />
    </div>
  )
}
