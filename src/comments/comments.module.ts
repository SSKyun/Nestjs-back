import { Comment } from '../comments/comment.entity';
import { BoardsService } from './../boards/boards.service';
import { BoardsModule } from './../boards/boards.module';
import { AuthModule } from './../auth/auth.module';
import { CommentRepository } from './comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([Comment]),
    AuthModule,
    BoardsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService,CommentRepository]
})
export class CommentsModule {}
