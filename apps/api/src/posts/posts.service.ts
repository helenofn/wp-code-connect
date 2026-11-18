import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreatePostDto, ListPostsQuery } from './post.schemas.js';
import type { PostDetailsResponse, PostPageResponse } from './post.response.js';
import { PostsRepository } from './posts.repository.js';

const MAX_SEARCH_TERMS = 8;

/**
 * Turns free text into a prefix `to_tsquery` expression ("reac nati" →
 * "reac:* & nati:*"), so results show up while the user is still typing.
 * Only letters and numbers survive, which keeps tsquery syntax out of user
 * input. Returns undefined when nothing searchable is left.
 */
export function toPrefixTsQuery(text: string | undefined): string | undefined {
  const terms = text?.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  if (terms.length === 0) return undefined;
  return terms
    .slice(0, MAX_SEARCH_TERMS)
    .map((term) => `${term}:*`)
    .join(' & ');
}

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async list(
    { q, tags, sort, page, limit }: ListPostsQuery,
    viewerId?: string,
  ): Promise<PostPageResponse> {
    const { items, total } = await this.postsRepository.list({
      tsQuery: toPrefixTsQuery(q),
      tags,
      sort,
      page,
      limit,
      viewerId,
    });
    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string, viewerId?: string): Promise<PostDetailsResponse> {
    const post = await this.postsRepository.findById(id, viewerId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async create(
    authorId: string,
    { title, description, code, thumbnailUrl, tags }: CreatePostDto,
  ): Promise<PostDetailsResponse> {
    const id = await this.postsRepository.create({
      authorId,
      title,
      description,
      code: code?.trim() ? code : null,
      thumbnailUrl: thumbnailUrl ?? null,
      tags,
    });
    return this.findById(id, authorId);
  }

  async like(postId: string, userId: string): Promise<void> {
    await this.ensureExists(postId);
    await this.postsRepository.like(postId, userId);
  }

  async unlike(postId: string, userId: string): Promise<void> {
    await this.ensureExists(postId);
    await this.postsRepository.unlike(postId, userId);
  }

  async ensureExists(postId: string): Promise<void> {
    if (!(await this.postsRepository.exists(postId))) {
      throw new NotFoundException('Post not found');
    }
  }
}
