import { likePost, unlikePost, type PostSummary } from '../services/api/posts'

/** O post com a curtida do usuário aplicada (ou removida), para atualizar a tela na hora. */
export function withLike<T extends PostSummary>(post: T, liked: boolean): T {
  if (post.likedByMe === liked) return post
  return { ...post, likedByMe: liked, likesCount: Math.max(0, post.likesCount + (liked ? 1 : -1)) }
}

export function sendLike(postId: string, liked: boolean): Promise<void> {
  return liked ? likePost(postId) : unlikePost(postId)
}
