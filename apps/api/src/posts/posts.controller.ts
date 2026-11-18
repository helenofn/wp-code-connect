import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import type {
  AuthenticatedRequest,
  OptionalAuthRequest,
} from '../auth/jwt-payload.js';
import { OptionalAuthGuard } from '../auth/optional-auth.guard.js';
import {
  POST_SORTS,
  createPostSchema,
  listPostsQuerySchema,
  postIdSchema,
  type CreatePostDto,
  type ListPostsQuery,
} from './post.schemas.js';
import { PostDetailsResponse, PostPageResponse } from './post.response.js';
import { PostsService } from './posts.service.js';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiQuery({ name: 'q', required: false, description: 'Full-text search' })
  @ApiQuery({
    name: 'tags',
    required: false,
    description: 'Comma-separated; posts must have all of them',
    example: 'react,front-end',
  })
  @ApiQuery({ name: 'sort', required: false, enum: POST_SORTS })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 12 })
  @ApiOkResponse({ type: PostPageResponse })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  list(
    @Query({ schema: listPostsQuerySchema }) query: ListPostsQuery,
    @Req() request: OptionalAuthRequest,
  ): Promise<PostPageResponse> {
    return this.postsService.list(query, request.user?.sub);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiOkResponse({ type: PostDetailsResponse })
  @ApiNotFoundResponse({ description: 'Post not found' })
  findOne(
    @Param('id', { schema: postIdSchema }) id: string,
    @Req() request: OptionalAuthRequest,
  ): Promise<PostDetailsResponse> {
    return this.postsService.findById(id, request.user?.sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    type: PostDetailsResponse,
    description: 'Post created. The Location header points to it.',
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  async create(
    @Body({ schema: createPostSchema }) dto: CreatePostDto,
    @Req() request: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PostDetailsResponse> {
    const post = await this.postsService.create(request.user.sub, dto);
    res.location(`/posts/${post.id}`);
    return post;
  }

  @Put(':id/likes/me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'The signed-in user likes the post' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  like(
    @Param('id', { schema: postIdSchema }) id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.postsService.like(id, request.user.sub);
  }

  @Delete(':id/likes/me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'The like is removed (if any)' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token' })
  unlike(
    @Param('id', { schema: postIdSchema }) id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.postsService.unlike(id, request.user.sub);
  }
}
