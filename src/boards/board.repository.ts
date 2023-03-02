import { User } from 'src/auth/user.entity';
import { Injectable } from '@nestjs/common';
import { DataSource,Repository } from 'typeorm';
import { BoardStatus } from './board-status.enum';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Injectable()
export class BoardRepository extends Repository<Board> {
    constructor(private dataSource: DataSource) {
        super(Board, dataSource.createEntityManager());
    }
    async createBoard(createBoardDto:CreateBoardDto, user:{[key : string] : any}): Promise<Board> {
        const user1 = await User.findOneBy({id : user['sub']})
        
        const { title, description} = createBoardDto;
        const board = this.create({
            title,
            description,
            status: BoardStatus.PUBLIC,
            user : user1
        })
        
        await this.save(board);
        return board;
    }

}