import { api } from './client'

export interface Author {
  id: string
  name: string
  username: string
}

export interface PostSummary {
  id: string
  title: string
  description: string
  /** `null` quando o post não tem imagem: a tela mostra um placeholder. */
  thumbnailUrl: string | null
  tags: string[]
  likesCount: number
  commentsCount: number
  likedByMe: boolean
  author: Author
  createdAt: string
}

export interface PostDetails extends PostSummary {
  code: string | null
}

export type PostSort = '-createdAt' | '-likesCount'

export interface PostPage {
  items: PostSummary[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export interface ListPostsParams {
  q?: string
  tags?: string[]
  sort?: PostSort
  page?: number
  limit?: number
}

export interface CreatePostInput {
  title: string
  description: string
  code?: string
  thumbnailUrl?: string
  tags: string[]
}

export async function listPosts(
  { q, tags, sort, page, limit }: ListPostsParams,
  signal?: AbortSignal,
): Promise<PostPage> {
  const { data } = await api.get<PostPage>('/posts', {
    params: { q: q || undefined, tags: tags?.length ? tags.join(',') : undefined, sort, page, limit },
    signal,
  })
  return data
}

export async function getPost(id: string, signal?: AbortSignal): Promise<PostDetails> {
  const { data } = await api.get<PostDetails>(`/posts/${id}`, { signal })
  return data
}

export async function createPost(input: CreatePostInput): Promise<PostDetails> {
  const { data } = await api.post<PostDetails>('/posts', input)
  return data
}

export async function likePost(id: string): Promise<void> {
  await api.put(`/posts/${id}/likes/me`)
}

export async function unlikePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}/likes/me`)
}
