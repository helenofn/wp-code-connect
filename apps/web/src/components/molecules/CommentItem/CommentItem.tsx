import type { ReactNode } from 'react'
import { Avatar } from '../../atoms/Avatar/Avatar'

interface CommentItemProps {
  authorName: string
  username: string
  body: string
  /** Ações abaixo do texto (ex.: "Responder"). */
  children?: ReactNode
}

/** Um comentário: avatar, @usuário e texto, com as ações embaixo. */
export function CommentItem({ authorName, username, body, children }: CommentItemProps) {
  return (
    <article className="flex flex-col gap-2 text-cinza-escuro">
      <div className="flex items-start gap-2">
        <Avatar name={authorName} />
        <p className="min-w-0 py-1 text-base/normal break-words">
          <strong className="mr-2 font-semibold" title={authorName}>
            @{username}
          </strong>
          {body}
        </p>
      </div>
      {children}
    </article>
  )
}
