import type { PostSummary } from '../../../services/api/posts'
import { PostCard } from '../PostCard/PostCard'

interface PostGridProps {
  posts: PostSummary[]
  /** id do painel (as abas do feed apontam para ele). */
  id?: string
  /** Sem ele (visitantes), as curtidas aparecem só como contador. */
  onToggleLike?: (post: PostSummary) => void
  onShare?: (post: PostSummary) => void
  onTagClick?: (tag: string) => void
}

/** Grid de cards do feed: uma coluna no celular, duas a partir do tablet. */
export function PostGrid({ posts, id, onToggleLike, onShare, onTagClick }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <p id={id} className="py-10 text-center text-lg/normal text-cinza-medio">
        Nenhum post encontrado.
      </p>
    )
  }
  return (
    <ul id={id} className="grid gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard
            post={post}
            onToggleLike={onToggleLike && (() => onToggleLike(post))}
            onShare={onShare && (() => onShare(post))}
            onTagClick={onTagClick}
          />
        </li>
      ))}
    </ul>
  )
}
