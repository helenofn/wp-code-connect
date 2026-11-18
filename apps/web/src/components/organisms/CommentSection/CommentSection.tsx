import { useId, useState, type FormEvent } from 'react'
import { Alert } from '../../atoms/Alert/Alert'
import { Button } from '../../atoms/Button/Button'
import { Link } from '../../atoms/Link/Link'
import { CommentItem } from '../../molecules/CommentItem/CommentItem'
import { TextareaField } from '../../molecules/TextareaField/TextareaField'
import type { Comment, CommentThread } from '../../../services/api/comments'

interface CommentSectionProps {
  threads: CommentThread[]
  /** Só usuários logados comentam e respondem. */
  canComment: boolean
  /**
   * Envia um comentário (ou resposta, com `parentId`). Deve rejeitar com um
   * `Error` cuja mensagem possa ir para a tela.
   */
  onSubmit: (body: string, parentId?: string) => Promise<void>
  /** Rota de login mostrada a visitantes. */
  loginTo?: string
}

const actionClass =
  'self-start rounded text-base/normal font-semibold text-cinza-escuro hover:underline focus-visible:outline-2 focus-visible:outline-cinza-escuro'

/**
 * Seção "Comentários" do Figma. As respostas têm um nível só: responder a uma
 * resposta continua na mesma conversa, já mencionando o @autor.
 */
export function CommentSection({ threads, canComment, onSubmit, loginTo = '/login' }: CommentSectionProps) {
  const titleId = useId()
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const [replyTo, setReplyTo] = useState<{ threadId: string; mention: string }>()

  function toggle(threadId: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(threadId)) next.delete(threadId)
      else next.add(threadId)
      return next
    })
  }

  async function submitReply(threadId: string, body: string) {
    await onSubmit(body, threadId)
    setReplyTo(undefined)
    setExpanded((current) => new Set(current).add(threadId))
  }

  function replyButton(threadId: string, comment: Comment) {
    if (!canComment) return null
    return (
      <button
        type="button"
        className={actionClass}
        onClick={() => setReplyTo({ threadId, mention: `@${comment.author.username} ` })}
      >
        Responder
      </button>
    )
  }

  return (
    <section
      id="comentarios"
      aria-labelledby={titleId}
      className="flex flex-col gap-6 rounded-lg bg-cinza-medio px-4 py-8 sm:px-8"
    >
      <h2 id={titleId} className="text-2xl/normal font-semibold text-cinza-escuro">
        Comentários
      </h2>

      {canComment ? (
        <CommentForm label="Escreva um comentário" submitLabel="Comentar" onSubmit={(body) => onSubmit(body)} />
      ) : (
        <p className="text-base/normal text-cinza-escuro">
          <Link to={loginTo} variant="underline-dark">
            Entre
          </Link>{' '}
          para comentar e curtir.
        </p>
      )}

      {threads.length === 0 ? (
        <p className="text-base/normal text-cinza-escuro">Nenhum comentário ainda. Seja o primeiro!</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {threads.map((thread, index) => {
            const isOpen = expanded.has(thread.id)
            const repliesId = `${titleId}-${thread.id}`
            return (
              <li key={thread.id} className="flex flex-col gap-4">
                {index > 0 && <hr className="border-cinza-escuro" />}
                <CommentItem
                  authorName={thread.author.name}
                  username={thread.author.username}
                  body={thread.body}
                >
                  {replyButton(thread.id, thread)}
                  {thread.replies.length > 0 && (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={repliesId}
                      onClick={() => toggle(thread.id)}
                      className="flex items-center gap-2 self-start rounded text-xs/normal text-cinza-escuro hover:underline focus-visible:outline-2 focus-visible:outline-cinza-escuro"
                    >
                      <span aria-hidden="true" className="h-px w-8 bg-cinza-escuro" />
                      {isOpen ? 'Ocultar respostas' : `Ver respostas (${thread.replies.length})`}
                    </button>
                  )}
                </CommentItem>

                {isOpen && (
                  <ul id={repliesId} className="flex flex-col gap-4 pl-10">
                    {thread.replies.map((reply) => (
                      <li key={reply.id}>
                        <CommentItem
                          authorName={reply.author.name}
                          username={reply.author.username}
                          body={reply.body}
                        >
                          {replyButton(thread.id, reply)}
                        </CommentItem>
                      </li>
                    ))}
                  </ul>
                )}

                {replyTo?.threadId === thread.id && (
                  <div className="pl-10">
                    <CommentForm
                      label={`Responder a @${thread.author.username}`}
                      submitLabel="Enviar resposta"
                      initialBody={replyTo.mention}
                      autoFocus
                      onSubmit={(body) => submitReply(thread.id, body)}
                      onCancel={() => setReplyTo(undefined)}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

interface CommentFormProps {
  label: string
  submitLabel: string
  initialBody?: string
  autoFocus?: boolean
  onSubmit: (body: string) => Promise<void>
  onCancel?: () => void
}

function CommentForm({ label, submitLabel, initialBody = '', autoFocus, onSubmit, onCancel }: CommentFormProps) {
  const [body, setBody] = useState(initialBody)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    setError(undefined)
    try {
      await onSubmit(body.trim())
      setBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Algo deu errado. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <TextareaField
        label={label}
        tone="dark"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        maxLength={1000}
        required
        autoFocus={autoFocus}
        // O cursor vai para depois da @menção já preenchida.
        onFocus={(e) => {
          const end = e.currentTarget.value.length
          e.currentTarget.setSelectionRange(end, end)
        }}
      />
      {error && <Alert tone="dark">{error}</Alert>}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {onCancel && (
          <Button type="button" variant="outline-dark" onClick={onCancel} className="sm:w-auto">
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting} aria-busy={submitting} className="sm:w-auto">
          {submitting ? 'Enviando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
