import { z } from 'zod';

export const createCommentSchema = z
  .object({
    body: z.string().trim().min(1).max(1000),
    /** Top-level comment being replied to. Replies are one level deep. */
    parentId: z.uuid().optional(),
  })
  .meta({ id: 'CreateCommentDto' });

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
