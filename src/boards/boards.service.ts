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


    async getAllBoards(): Promise<Board[]> {
        return this.boardRepository.find();
    }

    createBoard(createBoardDto:CreateBoardDto): Promise<Board> {
        return this.boardRepository.createBoard(createBoardDto);
    }

    async deleteBoard(id : number) : Promise<void>  {
        const result = await this.boardRepository.delete(id);
        
        if(result.affected == 0){
            throw new NotFoundException(`Can't find Board with id ${id}`);
        }
        
        console.log('result',result);
    }

    async getBoardById(id: any): Promise <Board>{
        const found = await this.boardRepository.findOneBy(id);

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

    // private boards: Board[] = []; 로컬 메모리부분.

    // getAllBoards(): Board[] {
    //     return this.boards;
    // }//전체 검색

    // createBoard(createBoardDto:CreateBoardDto){
    //     // const title = createBoardDto.title 아래와 동일.
    //     const {title, description} = createBoardDto;
    //     const board: Board = {
    //         id: uuid(),//id가 unique한 값을 게시판의 아이디로 줄 수 있다.
    //         title,//title: title,
    //         description,//description : description,
    //         status: BoardStatus.PUBLIC,
    //     }
    //     this.boards.push(board);
    //     return board;
    // }

    // getBoardById(id: string): Board{
    //     const found = this.boards.find((board)=> board.id === id);
    //     if(!found){
    //         throw new NotFoundException(`Can't find Board with id : ${id}`);
    //     }
    //     return found;
    // }

    // deleteBoard(id: string):void {
    //     const found = this.getBoardById(id); //없는 게시물을 지우려할 때도 에러값 출력
    //     this.boards = this.boards.filter((board)=>board.id !== found.id);
    // }

    // updateBoardStatus(id: string, status:BoardStatus): Board {
    //     const board= this.getBoardById(id);
    //     board.status = status;
    //     return board;
    // }

}
