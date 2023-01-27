import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import {BoardStatus} from './board-status.enum';
import { Board } from './board.entity';

@Controller('boards')
export class BoardsController {
    private hi = "hi Sung"

    constructor(private boardsService:BoardsService){}

    @Get("/hi")
    getHi() : string {
        return this.hi;
    }

    @Post("/setbye")
    setHi(@Body() body: {hi : string}) : {ok : boolean, message : string} {
        this.hi = body.hi
        console.log(body)
        return {
            ok : true,
            message : "success"
        }
    }

    @Get()
    getAllBoard(): Promise<Board[]>{
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto:CreateBoardDto): Promise<Board>{
        return this.boardsService.createBoard(createBoardDto);
    }

    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise<Board>{
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe)id): Promise<void>{
        return this.boardsService.deleteBoard(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id',ParseIntPipe) id: number,
        @Body('status',BoardStatusValidationPipe) status: BoardStatus
    ){
        return this.boardsService.updateBoardStatus(id,status)
    }
}
