import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { PostsService } from '../posts/posts.service.js';
import type {
  CommentRecord,
  CommentRow,
  CommentsRepository,
  NewCommentRecord,
} from './comments.repository.js';
import { CommentsService } from './comments.service.js';

const author = { id: 'user-1', name: 'Ada', username: 'ada' };

function createFakeRepository() {
  const rows: CommentRow[] = [];
  return {
    rows,
    listByPost: vi.fn((postId: string) =>
      Promise.resolve(rows.filter((c) => c.postId === postId)),
    ),
    findById: vi.fn((id: string) => {
      const row = rows.find((c) => c.id === id);
      return Promise.resolve(
        row &&
          ({ ...row, authorId: row.author.id } as unknown as CommentRecord),
      );
    }),
    create: vi.fn((data: NewCommentRecord) => {
      const comment: CommentRow = {
        id: `comment-${rows.length + 1}`,
        postId: data.postId,
        parentId: data.parentId,
        body: data.body,
        author,
        createdAt: new Date(),
      };
      rows.push(comment);
      return Promise.resolve(comment);
    }),
  };
}

describe('CommentsService', () => {
  let repository: ReturnType<typeof createFakeRepository>;
  let postsService: { ensureExists: ReturnType<typeof vi.fn> };
  let service: CommentsService;

  beforeEach(() => {
    repository = createFakeRepository();
    postsService = {
      ensureExists: vi.fn((postId: string) =>
        postId.startsWith('post-')
          ? Promise.resolve()
          : Promise.reject(new NotFoundException('Post not found')),
      ),
    };
    service = new CommentsService(
      repository as unknown as CommentsRepository,
      postsService as unknown as PostsService,
    );
  });

  it('nests replies under their top-level comment', async () => {
    const first = await service.create('post-1', 'user-1', { body: 'Oi' });
    const reply = await service.create('post-1', 'user-1', {
      body: 'Resposta',
      parentId: first.id,
    });
    const second = await service.create('post-1', 'user-1', { body: 'Outro' });

    const { items } = await service.list('post-1');

    expect(items).toEqual([
      { ...first, replies: [reply] },
      { ...second, replies: [] },
    ]);
  });

  it('rejects a reply to a reply with 422', async () => {
    const first = await service.create('post-1', 'user-1', { body: 'Oi' });
    const reply = await service.create('post-1', 'user-1', {
      body: 'Resposta',
      parentId: first.id,
    });

    await expect(
      service.create('post-1', 'user-1', { body: 'Deep', parentId: reply.id }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('rejects a parent from another post with 422', async () => {
    const other = await service.create('post-2', 'user-1', { body: 'Oi' });

    await expect(
      service.create('post-1', 'user-1', { body: 'X', parentId: other.id }),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('throws 404 for a missing post', async () => {
    await expect(
      service.create('missing', 'user-1', { body: 'Oi' }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
