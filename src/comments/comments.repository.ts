import { User } from 'src/auth/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Repository, DataSource } from 'typeorm';
import { Comment } from './comment.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentRepository extends Repository<Comment> {
    constructor(private dataSource : DataSource) {
        super(Comment, dataSource.createEntityManager());
    }
    // async createComment(boardId:number,createCommentDto:CreateCommentDto,user:{[key:string]:any}):Promise<Comment>{
    //     const user1 = await User.findOneBy({id: user['sub']});
    //     const board = await this.findOneBy({boardId})

    //     const {content} = createCommentDto;
    //     const comment = this.create({
    //         content,
    //         user:user1
    //     });
    //     await this.save(comment);
    //     return comment;
    // }
}