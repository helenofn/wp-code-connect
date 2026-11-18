import { z } from 'zod';

export const POST_SORTS = ['-createdAt', '-likesCount'] as const;
export type PostSort = (typeof POST_SORTS)[number];

const tag = z.string().trim().toLowerCase().min(1).max(30);

export const listPostsQuerySchema = z
  .object({
    /** Full-text search over title and description. */
    q: z.string().trim().max(100).optional(),
    /** Comma-separated tags; a post must have all of them. */
    tags: z
      .string()
      .optional()
      .transform((value) => [
        ...new Set(
          (value ?? '')
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean),
        ),
      ])
      .pipe(z.array(tag).max(5)),
    sort: z.enum(POST_SORTS).default('-createdAt'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  })
  .meta({ id: 'ListPostsQuery' });

export type ListPostsQuery = z.infer<typeof listPostsQuerySchema>;

export const createPostSchema = z
  .object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(2000),
    code: z.string().max(10_000).optional(),
    thumbnailUrl: z
      .url({ protocol: /^https?$/ })
      .max(2048)
      .optional(),
    tags: z
      .array(tag)
      .max(5)
      .default([])
      .transform((tags) => [...new Set(tags)]),
  })
  .meta({ id: 'CreatePostDto' });

export type CreatePostDto = z.infer<typeof createPostSchema>;

export const postIdSchema = z.uuid();
