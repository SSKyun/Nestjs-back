import { BoardRepository } from './../boards/boards.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentRepository } from './comments.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { User } from 'src/auth/user.entity';
import { BoardsModule } from './../boards/boards.module';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentRepository)
        private commentRepository: CommentRepository,
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
    ){}

    async createComment(boardId:number,createCommentDto:CreateCommentDto,user:{[key:string]:any}):Promise<Comment>{
        const user1 = await User.findOneBy({id: user['sub']});
        const board = await this.boardRepository.findOneBy({id : boardId});
        if (!board) {
            throw new NotFoundException(`Board with id ${boardId} not found`);
          }
      
          const comment = new Comment();
          comment.content = createCommentDto.content;
          comment.board = board;
          comment.user = user1;
      
          board.comments.push(comment);
          await board.save();
      
          return comment;
    }
}