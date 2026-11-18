import { Link } from 'react-router'
import { PostThumbnail } from '../../atoms/PostThumbnail/PostThumbnail'
import { Tag } from '../../atoms/Tag/Tag'
import { AuthorBadge } from '../../molecules/AuthorBadge/AuthorBadge'
import { StatButton } from '../../molecules/StatButton/StatButton'
import type { PostSummary } from '../../../services/api/posts'

interface PostCardProps {
  post: PostSummary
  /**
   * `feed`: card do grid, com título linkando para o post.
   * `details`: card grande do topo da página do post, com o título como `h1`.
   */
  variant?: 'feed' | 'details'
  /** Só para usuários logados; sem ele, as curtidas aparecem só como contador. */
  onToggleLike?: () => void
  onShare?: () => void
  /** Clicar numa tag (ex.: filtrar o feed por ela). */
  onTagClick?: (tag: string) => void
}

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

/** "Card publicação" do Figma, compartilhado pelo feed e pela página do post. */
export function PostCard({ post, variant = 'feed', onToggleLike, onShare, onTagClick }: PostCardProps) {
  const isFeed = variant === 'feed'
  const href = `/posts/${post.id}`
  const likes = plural(post.likesCount, 'curtida', 'curtidas')
  const comments = plural(post.commentsCount, 'comentário', 'comentários')

  return (
    <article className="flex h-full flex-col">
      {isFeed ? (
        // A imagem repete o link do título: fica fora da ordem de tabulação.
        <Link to={href} tabIndex={-1} aria-hidden="true" className="block h-60 rounded-t-lg bg-cinza-medio p-6">
          <PostThumbnail src={post.thumbnailUrl} alt={post.title} />
        </Link>
      ) : (
        <div className="rounded-t-lg bg-cinza-medio px-4 py-6">
          <div className="h-48 sm:h-80">
            <PostThumbnail src={post.thumbnailUrl} alt={post.title} priority />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 rounded-b-lg bg-cinza-escuro p-4">
        <div className="flex flex-col gap-2 text-cinza-claro">
          {isFeed ? (
            <h2 className="text-lg/normal font-semibold">
              <Link
                to={href}
                className="rounded hover:underline focus-visible:outline-2 focus-visible:outline-verde-destaque"
              >
                {post.title}
              </Link>
            </h2>
          ) : (
            <h1 className="text-2xl/normal font-semibold">{post.title}</h1>
          )}
          <p className={`text-base/normal ${isFeed ? 'line-clamp-3' : 'whitespace-pre-line'}`}>
            {post.description}
          </p>
        </div>

        {post.tags.length > 0 && (
          <ul aria-label="Tags" className="flex flex-wrap gap-2.5">
            {post.tags.map((tag) => (
              <li key={tag}>
                {onTagClick ? (
                  <Tag onClick={() => onTagClick(tag)} label={`Filtrar por ${tag}`}>
                    {tag}
                  </Tag>
                ) : (
                  <Tag>{tag}</Tag>
                )}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StatButton
              icon="code"
              count={post.likesCount}
              label={onToggleLike ? `${post.likedByMe ? 'Descurtir' : 'Curtir'}. ${likes}` : likes}
              onClick={onToggleLike}
              pressed={onToggleLike ? post.likedByMe : undefined}
            />
            {onShare && <StatButton icon="share" label="Compartilhar" onClick={onShare} />}
            <StatButton
              icon="chat"
              count={post.commentsCount}
              label={comments}
              to={`${href}#comentarios`}
            />
          </div>
          <AuthorBadge name={post.author.name} username={post.author.username} />
        </div>
      </div>
    </article>
  )
}
