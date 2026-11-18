import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-payload.js';
import { postIdSchema } from '../posts/post.schemas.js';
import {
  createCommentSchema,
  type CreateCommentDto,
} from './comment.schemas.js';
import { CommentListResponse, CommentResponse } from './comment.response.js';
import { CommentsService } from './comments.service.js';

@ApiTags('comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiOkResponse({ type: CommentListResponse })
  @ApiNotFoundResponse({ description: 'Post not found' })
  list(
    @Param('postId', { schema: postIdSchema }) postId: string,
  ): Promise<CommentListResponse> {
    return this.commentsService.list(postId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: CommentResponse,
    description: 'Comment created. The Location header points to it.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnprocessableEntityResponse({
    description: 'parentId is not a top-level comment of this post',
  })
  async create(
    @Param('postId', { schema: postIdSchema }) postId: string,
    @Body({ schema: createCommentSchema }) dto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CommentResponse> {
    const comment = await this.commentsService.create(
      postId,
      request.user.sub,
      dto,
    );
    res.location(`/posts/${postId}/comments/${comment.id}`);
    return comment;
  }
}
