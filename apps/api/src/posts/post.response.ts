import { ApiProperty } from '@nestjs/swagger';

export class AuthorResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Julio Cesar' })
  name: string;

  @ApiProperty({ example: 'julio' })
  username: string;
}

export class PostSummaryResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Introdução ao React' })
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: String,
    nullable: true,
    format: 'uri',
    description: 'Null when the post has no image; clients show a placeholder.',
  })
  thumbnailUrl: string | null;

  @ApiProperty({ type: [String], example: ['react', 'front-end'] })
  tags: string[];

  @ApiProperty({ example: 12 })
  likesCount: number;

  @ApiProperty({ example: 3 })
  commentsCount: number;

  @ApiProperty({ description: 'Always false for anonymous requests.' })
  likedByMe: boolean;

  @ApiProperty({ type: AuthorResponse })
  author: AuthorResponse;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class PostDetailsResponse extends PostSummaryResponse {
  @ApiProperty({ type: String, nullable: true })
  code: string | null;
}

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  limit: number;

  @ApiProperty({ example: 40 })
  total: number;

  @ApiProperty({ example: 4 })
  totalPages: number;
}

export class PostPageResponse {
  @ApiProperty({ type: [PostSummaryResponse] })
  items: PostSummaryResponse[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
