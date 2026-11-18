import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { asc, eq, sql } from 'drizzle-orm';
import type { Database } from '../database/database.module.js';
import { comments, posts, users } from '../database/schema.js';
import type { AuthorResponse } from '../posts/post.response.js';

export type CommentRecord = typeof comments.$inferSelect;

/** A comment with its author, as the API returns it. */
export interface CommentRow {
  id: string;
  postId: string;
  parentId: string | null;
  body: string;
  author: AuthorResponse;
  createdAt: Date;
}

export interface NewCommentRecord {
  postId: string;
  authorId: string;
  parentId: string | null;
  body: string;
}

const commentColumns = {
  id: comments.id,
  postId: comments.postId,
  parentId: comments.parentId,
  body: comments.body,
  author: { id: users.id, name: users.name, username: users.username },
  createdAt: comments.createdAt,
};

@Injectable()
export class CommentsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  /** Every comment of the post, replies included, oldest first. */
  listByPost(postId: string): Promise<CommentRow[]> {
    return this.db
      .select(commentColumns)
      .from(comments)
      .innerJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.postId, postId))
      .orderBy(asc(comments.createdAt), asc(comments.id));
  }

  async findById(id: string): Promise<CommentRecord | undefined> {
    const [comment] = await this.db
      .select()
      .from(comments)
      .where(eq(comments.id, id))
      .limit(1);
    return comment;
  }

  /** Inserts the comment and bumps the post's counter in one transaction. */
  async create(data: NewCommentRecord): Promise<CommentRow> {
    const id = await this.db.transaction(async (tx) => {
      const [comment] = await tx
        .insert(comments)
        .values(data)
        .returning({ id: comments.id });
      await tx
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} + 1` })
        .where(eq(posts.id, data.postId));
      return comment!.id;
    });
    const [created] = await this.db
      .select(commentColumns)
      .from(comments)
      .innerJoin(users, eq(users.id, comments.authorId))
      .where(eq(comments.id, id));
    return created!;
  }
}
