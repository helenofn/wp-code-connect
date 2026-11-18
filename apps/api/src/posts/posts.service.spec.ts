import { NotFoundException } from '@nestjs/common';
import type { PostDetailsResponse } from './post.response.js';
import type { PostsRepository } from './posts.repository.js';
import { PostsService, toPrefixTsQuery } from './posts.service.js';

const post: PostDetailsResponse = {
  id: 'post-1',
  title: 'React zero to hero',
  description: 'Do básico ao avançado',
  code: 'const a = 1',
  thumbnailUrl: null,
  tags: ['react'],
  likesCount: 0,
  commentsCount: 0,
  likedByMe: false,
  author: { id: 'user-1', name: 'Ada', username: 'ada' },
  createdAt: new Date(),
};

function createFakeRepository() {
  return {
    list: vi.fn().mockResolvedValue({ items: [post], total: 25 }),
    findById: vi.fn((id: string) =>
      Promise.resolve(id === post.id ? post : undefined),
    ),
    exists: vi.fn((id: string) => Promise.resolve(id === post.id)),
    create: vi.fn().mockResolvedValue(post.id),
    like: vi.fn().mockResolvedValue(undefined),
    unlike: vi.fn().mockResolvedValue(undefined),
  };
}

describe('toPrefixTsQuery', () => {
  it('turns each word into a prefix term joined by AND', () => {
    expect(toPrefixTsQuery('React  Acessibi')).toBe('react:* & acessibi:*');
  });

  it('keeps accented letters and numbers', () => {
    expect(toPrefixTsQuery('código es2024')).toBe('código:* & es2024:*');
  });

  it('strips tsquery operators from user input', () => {
    expect(toPrefixTsQuery("react & !(node) | 'x':*")).toBe(
      'react:* & node:* & x:*',
    );
  });

  it('returns undefined when nothing searchable is left', () => {
    expect(toPrefixTsQuery(undefined)).toBeUndefined();
    expect(toPrefixTsQuery('   ')).toBeUndefined();
    expect(toPrefixTsQuery('&|!()')).toBeUndefined();
  });
});

describe('PostsService', () => {
  let repository: ReturnType<typeof createFakeRepository>;
  let service: PostsService;

  beforeEach(() => {
    repository = createFakeRepository();
    service = new PostsService(repository as unknown as PostsRepository);
  });

  it('lists posts with pagination metadata', async () => {
    const page = await service.list(
      {
        q: 'react',
        tags: ['front-end'],
        sort: '-likesCount',
        page: 2,
        limit: 12,
      },
      'user-1',
    );

    expect(repository.list).toHaveBeenCalledWith({
      tsQuery: 'react:*',
      tags: ['front-end'],
      sort: '-likesCount',
      page: 2,
      limit: 12,
      viewerId: 'user-1',
    });
    expect(page).toEqual({
      items: [post],
      meta: { page: 2, limit: 12, total: 25, totalPages: 3 },
    });
  });

  it('throws 404 for a missing post', async () => {
    await expect(service.findById('missing')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('creates a post and returns it with its author', async () => {
    const created = await service.create('user-1', {
      title: 'React zero to hero',
      description: 'Do básico ao avançado',
      code: '   ',
      tags: ['react'],
    });

    expect(repository.create).toHaveBeenCalledWith({
      authorId: 'user-1',
      title: 'React zero to hero',
      description: 'Do básico ao avançado',
      code: null,
      thumbnailUrl: null,
      tags: ['react'],
    });
    expect(created).toBe(post);
  });

  it('likes and unlikes an existing post', async () => {
    await service.like(post.id, 'user-1');
    await service.unlike(post.id, 'user-1');

    expect(repository.like).toHaveBeenCalledWith(post.id, 'user-1');
    expect(repository.unlike).toHaveBeenCalledWith(post.id, 'user-1');
  });

  it('throws 404 when liking a missing post', async () => {
    await expect(service.like('missing', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.like).not.toHaveBeenCalled();
  });
});
