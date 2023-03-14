import { BoardsService } from 'src/boards/boards.service';
import { Param, Req, ValidationPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { AccessTokenGuard } from './../auth/guard/accessToken.guard';
import { Body, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { Request } from 'express';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
@UseGuards(AccessTokenGuard)
export class CommentsController {
    constructor(
        private commentsService : CommentsService,
    ) { }

    @Post(':boardId')
    async createComment(
        @Param('boardId') boardId: number,
        @Body() createCommentDto: CreateCommentDto,
        @Req() req:Request): Promise<Comment> {
        return this.commentsService.createComment(boardId, createCommentDto,req.user);
    }
}
