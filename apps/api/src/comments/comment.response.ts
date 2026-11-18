import { ApiProperty } from '@nestjs/swagger';
import { AuthorResponse } from '../posts/post.response.js';

export class CommentResponse {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  postId: string;

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  parentId: string | null;

  @ApiProperty({ example: 'Achei muito bom seu código, parabéns!' })
  body: string;

  @ApiProperty({ type: AuthorResponse })
  author: AuthorResponse;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class CommentThreadResponse extends CommentResponse {
  @ApiProperty({ type: [CommentResponse], description: 'Oldest first' })
  replies: CommentResponse[];
}

export class CommentListResponse {
  @ApiProperty({ type: [CommentThreadResponse], description: 'Oldest first' })
  items: CommentThreadResponse[];
}
