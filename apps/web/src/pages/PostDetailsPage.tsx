import axios from 'axios'
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { Alert } from '../components/atoms/Alert/Alert'
import { Link } from '../components/atoms/Link/Link'
import { Text } from '../components/atoms/Text/Text'
import { Toast } from '../components/atoms/Toast/Toast'
import { CodeBlock } from '../components/organisms/CodeBlock/CodeBlock'
import { CommentSection } from '../components/organisms/CommentSection/CommentSection'
import { PostCard } from '../components/organisms/PostCard/PostCard'
import { useToast } from '../hooks/useToast'
import { createComment, listComments, type CommentThread } from '../services/api/comments'
import { getErrorMessage, getErrorStatus } from '../services/api/errors'
import { getPost, type PostDetails } from '../services/api/posts'
import { shareMessages, sharePost } from '../services/share'
import { useSession } from '../session/SessionContext'
import { sendLike, withLike } from './likes'

/** Página do post: o mesmo card do feed em tamanho grande, o código e os comentários. */
export function PostDetailsPage() {
  const { id = '' } = useParams()
  const { hash } = useLocation()
  const session = useSession()
  const [post, setPost] = useState<PostDetails>()
  const [threads, setThreads] = useState<CommentThread[]>([])
  // Chave da última resposta: enquanto difere da atual, está carregando.
  const [loadedKey, setLoadedKey] = useState<string>()
  const [error, setError] = useState<{ key: string; message: string }>()
  const toast = useToast()

  const isAuthenticated = session.status === 'authenticated'
  const requestKey = `${id}|${session.status}`
  const status = error?.key === requestKey ? 'error' : loadedKey === requestKey ? 'ready' : 'loading'

  useEffect(() => {
    if (session.status === 'loading') return
    const key = `${id}|${session.status}`
    const controller = new AbortController()
    Promise.all([getPost(id, controller.signal), listComments(id, controller.signal)])
      .then(([loadedPost, loadedThreads]) => {
        setPost(loadedPost)
        setThreads(loadedThreads)
        setLoadedKey(key)
      })
      .catch((err: unknown) => {
        if (axios.isCancel(err)) return
        const message = getErrorStatus(err) === 404 ? 'Post não encontrado.' : getErrorMessage(err)
        setError({ key, message })
      })
    return () => controller.abort()
  }, [id, session.status])

  // Links "comentários" dos cards chegam com #comentarios: rola até a seção.
  useEffect(() => {
    if (status === 'ready' && hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView?.({ behavior: 'smooth' })
    }
  }, [status, hash])

  async function toggleLike() {
    if (!post) return
    const liked = !post.likedByMe
    setPost((current) => current && withLike(current, liked))
    try {
      await sendLike(post.id, liked)
    } catch (err) {
      setPost((current) => current && withLike(current, !liked))
      if (getErrorStatus(err) === 401) {
        session.signOut()
        toast.show('Sua sessão expirou. Entre de novo para curtir.')
      } else {
        toast.show(getErrorMessage(err))
      }
    }
  }

  async function share() {
    if (!post) return
    const message = shareMessages[await sharePost(post)]
    if (message) toast.show(message)
  }

  async function handleComment(body: string, parentId?: string) {
    try {
      const comment = await createComment(id, { body, parentId })
      setThreads((current) =>
        parentId
          ? current.map((thread) =>
              thread.id === parentId ? { ...thread, replies: [...thread.replies, comment] } : thread,
            )
          : [...current, { ...comment, replies: [] }],
      )
      setPost((current) => current && { ...current, commentsCount: current.commentsCount + 1 })
    } catch (err) {
      if (getErrorStatus(err) === 401) session.signOut()
      // O formulário mostra esta mensagem.
      throw new Error(
        getErrorStatus(err) === 401 ? 'Sua sessão expirou. Entre de novo para comentar.' : getErrorMessage(err),
      )
    }
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-start gap-6">
        <title>Post não encontrado | Code Connect</title>
        <h1 className="text-2xl/normal font-semibold">Ops!</h1>
        <Alert>{error?.message}</Alert>
        <Link to="/" variant="accent">
          Voltar para o feed
        </Link>
      </div>
    )
  }

  // Ao entrar ou sair da conta o post recarrega, mas o atual continua na tela.
  if (!post || post.id !== id) {
    return <Text variant="body">Carregando post...</Text>
  }

  return (
    <div className="flex flex-col gap-10">
      <title>{`${post.title} | Code Connect`}</title>
      <div className="flex flex-col gap-6">
        <PostCard
          post={post}
          variant="details"
          onToggleLike={isAuthenticated ? toggleLike : undefined}
          onShare={share}
        />
        {post.code && <CodeBlock code={post.code} />}
      </div>
      <CommentSection threads={threads} canComment={isAuthenticated} onSubmit={handleComment} />
      <Toast message={toast.message} />
    </div>
  )
}
