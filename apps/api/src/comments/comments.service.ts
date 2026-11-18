import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service.js';
import type { CreateCommentDto } from './comment.schemas.js';
import type { CommentListResponse } from './comment.response.js';
import { CommentsRepository, type CommentRow } from './comments.repository.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsService: PostsService,
  ) {}

  /** Top-level comments, each with its replies. */
  async list(postId: string): Promise<CommentListResponse> {
    await this.postsService.ensureExists(postId);
    const all = await this.commentsRepository.listByPost(postId);
    const items = all
      .filter((comment) => comment.parentId === null)
      .map((comment) => ({
        ...comment,
        replies: all.filter((reply) => reply.parentId === comment.id),
      }));
    return { items };
  }

  async create(
    postId: string,
    authorId: string,
    { body, parentId }: CreateCommentDto,
  ): Promise<CommentRow> {
    await this.postsService.ensureExists(postId);
    if (parentId) {
      const parent = await this.commentsRepository.findById(parentId);
      if (!parent || parent.postId !== postId) {
        throw new UnprocessableEntityException(
          'parentId must be a comment of this post',
        );
      }
      if (parent.parentId !== null) {
        throw new UnprocessableEntityException(
          'Replies can only answer a top-level comment',
        );
      }
    }
    return this.commentsRepository.create({
      postId,
      authorId,
      parentId: parentId ?? null,
      body,
    });
  }
}
