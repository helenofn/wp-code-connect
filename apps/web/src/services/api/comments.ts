import { api } from './client'
import type { Author } from './posts'

export interface Comment {
  id: string
  postId: string
  parentId: string | null
  body: string
  author: Author
  createdAt: string
}

/** Comentário de primeiro nível com suas respostas (só um nível). */
export interface CommentThread extends Comment {
  replies: Comment[]
}

export interface CreateCommentInput {
  body: string
  /** Comentário de primeiro nível que está sendo respondido. */
  parentId?: string
}

export async function listComments(postId: string, signal?: AbortSignal): Promise<CommentThread[]> {
  const { data } = await api.get<{ items: CommentThread[] }>(`/posts/${postId}/comments`, {
    signal,
  })
  return data.items
}

export async function createComment(postId: string, input: CreateCommentInput): Promise<Comment> {
  const { data } = await api.post<Comment>(`/posts/${postId}/comments`, input)
  return data
}
