import { User } from 'src/auth/user.entity';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { v1 as uuid } from 'uuid'; // npm i uuid --save
import {BoardStatus} from './board-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
    ){}//boardservice안에서 repository 사용가능하게함.


    async getAllBoards(
        //user:User
    ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        //query.where('board.userId = :userId',{ userId : user.id });

        // const boards = await query.getMany(); 자신의 게시물만 가져오기
        
        // // return boards;
        return this.boardRepository.find();
    }

    createBoard(createBoardDto : CreateBoardDto, user:{[key : string] : any}): Promise<Board> {
        console.log(user)
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    // async deleteBoard(id : number, user:{[key:string]:any}) : Promise<void>  {
    //     const result = await this.boardRepository.delete({id,user}); //delete 직접 들어가서 user인수 추가
    //     if(result.affected == 0){
    //         throw new NotFoundException(`Can't find Board with id ${id} && ${user}`);
    //     }
        
    //     console.log('result',result);
    // } 해당 유저만 삭제가능하게.

    async deleteBoard2(id:number):Promise<void>{
        const result = await this.boardRepository.delete(id);

        console.log('result',result);
    }

    async getBoardById(id: any): Promise <Board>{
        const found = await this.boardRepository.findOneBy({id});

        if(!found){
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        return found;
    }

    async updateBoardStatus(id: number, status: BoardStatus) : Promise<Board> {
        const board = await this.getBoardById(id);
        board.status = status;
        await this.boardRepository.save(board);

        return board;
    }
}
