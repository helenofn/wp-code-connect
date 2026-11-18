import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import {
  and,
  arrayContains,
  count,
  desc,
  eq,
  sql,
  type SQL,
} from 'drizzle-orm';
import type { Database } from '../database/database.module.js';
import { postLikes, posts, users } from '../database/schema.js';
import type { PostSort } from './post.schemas.js';
import type {
  PostDetailsResponse,
  PostSummaryResponse,
} from './post.response.js';

export interface PostListFilters {
  /** A ready `to_tsquery` expression (see `toPrefixTsQuery`). */
  tsQuery?: string;
  tags: string[];
  sort: PostSort;
  page: number;
  limit: number;
  viewerId?: string;
}

export interface NewPostRecord {
  authorId: string;
  title: string;
  description: string;
  code?: string | null;
  thumbnailUrl?: string | null;
  tags: string[];
}

@Injectable()
export class PostsRepository {
  constructor(@InjectDrizzle() private readonly db: Database) {}

  async list({
    tsQuery,
    tags,
    sort,
    page,
    limit,
    viewerId,
  }: PostListFilters): Promise<{
    items: PostSummaryResponse[];
    total: number;
  }> {
    const query = tsQuery
      ? sql`to_tsquery('portuguese', ${tsQuery})`
      : undefined;
    const where = and(
      query ? sql`${posts.searchVector} @@ ${query}` : undefined,
      tags.length ? arrayContains(posts.tags, tags) : undefined,
    );

    const orderBy: SQL[] = [
      sort === '-likesCount' ? desc(posts.likesCount) : desc(posts.createdAt),
    ];
    if (query) {
      orderBy.push(desc(sql`ts_rank(${posts.searchVector}, ${query})`));
    }
    orderBy.push(desc(posts.createdAt), desc(posts.id));

    const [items, [totalRow]] = await Promise.all([
      this.db
        .select(this.summaryColumns(viewerId))
        .from(posts)
        .innerJoin(users, eq(users.id, posts.authorId))
        .where(where)
        .orderBy(...orderBy)
        .limit(limit)
        .offset((page - 1) * limit),
      this.db.select({ total: count() }).from(posts).where(where),
    ]);
    return { items, total: totalRow?.total ?? 0 };
  }

  async findById(
    id: string,
    viewerId?: string,
  ): Promise<PostDetailsResponse | undefined> {
    const [post] = await this.db
      .select({ ...this.summaryColumns(viewerId), code: posts.code })
      .from(posts)
      .innerJoin(users, eq(users.id, posts.authorId))
      .where(eq(posts.id, id))
      .limit(1);
    return post;
  }

  async exists(id: string): Promise<boolean> {
    const [row] = await this.db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);
    return row !== undefined;
  }

  async create(data: NewPostRecord): Promise<string> {
    const [post] = await this.db
      .insert(posts)
      .values(data)
      .returning({ id: posts.id });
    return post!.id;
  }

  /** Idempotent: the counter only moves when a like row is actually added. */
  async like(postId: string, userId: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const added = await tx
        .insert(postLikes)
        .values({ postId, userId })
        .onConflictDoNothing()
        .returning({ postId: postLikes.postId });
      if (added.length) {
        await tx
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, postId));
      }
    });
  }

  /** Idempotent: the counter only moves when a like row is actually removed. */
  async unlike(postId: string, userId: string): Promise<void> {
    await this.db.transaction(async (tx) => {
      const removed = await tx
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
        .returning({ postId: postLikes.postId });
      if (removed.length) {
        await tx
          .update(posts)
          .set({ likesCount: sql`greatest(${posts.likesCount} - 1, 0)` })
          .where(eq(posts.id, postId));
      }
    });
  }

  private summaryColumns(viewerId?: string) {
    return {
      id: posts.id,
      title: posts.title,
      description: posts.description,
      thumbnailUrl: posts.thumbnailUrl,
      tags: posts.tags,
      likesCount: posts.likesCount,
      commentsCount: posts.commentsCount,
      likedByMe: viewerId
        ? sql<boolean>`exists (select 1 from ${postLikes} where ${postLikes.postId} = ${posts.id} and ${postLikes.userId} = ${viewerId})`
        : sql<boolean>`false`,
      author: { id: users.id, name: users.name, username: users.username },
      createdAt: posts.createdAt,
    };
  }
}
