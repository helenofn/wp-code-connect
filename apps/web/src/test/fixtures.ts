import type { CommentThread } from '../services/api/comments'
import type { PostDetails } from '../services/api/posts'

export function aPost(overrides: Partial<PostDetails> = {}): PostDetails {
  return {
    id: 'p1',
    title: 'React zero to hero',
    description: 'Componentes, hooks e acessibilidade.',
    code: 'const App = () => <h1>Oi</h1>',
    thumbnailUrl: '/thumbnails/project-1.png',
    tags: ['react', 'front-end'],
    likesCount: 12,
    commentsCount: 3,
    likedByMe: false,
    author: { id: 'u1', name: 'Julio Cesar', username: 'julio' },
    createdAt: '2026-11-17T00:00:00.000Z',
    ...overrides,
  }
}

export function aThread(overrides: Partial<CommentThread> = {}): CommentThread {
  return {
    id: 'c1',
    postId: 'p1',
    parentId: null,
    body: 'Quanto tempo você levou para finalizar esse projeto?',
    author: { id: 'u2', name: 'Gabriel Luz', username: 'gabriel_luz' },
    createdAt: '2026-11-17T01:00:00.000Z',
    replies: [
      {
        id: 'c2',
        postId: 'p1',
        parentId: 'c1',
        body: 'Até que foi rápido, uns 3 dias!',
        author: { id: 'u1', name: 'Julio Cesar', username: 'julio' },
        createdAt: '2026-11-17T02:00:00.000Z',
      },
    ],
    ...overrides,
  }
}
