import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe, UseGuards, Logger } from '@nestjs/common';
import {BoardStatus} from './board-status.enum';
import { Board } from './board.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
    private logger = new Logger('BoardsController');
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
    getAllBoard(
        @GetUser() user: User
    ): Promise<Board[]>{
        this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getAllBoards(user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto:CreateBoardDto,
    @GetUser() user:User): Promise<Board>{
        this.logger.verbose(`User ${user.username} creating a new board. Payload Title : ${createBoardDto.title}`)
        return this.boardsService.createBoard(createBoardDto,user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id:number) : Promise<Board>{
        return this.boardsService.getBoardById(id);
    }

    @Delete('/:id')
    deleteBoard(@Param('id', ParseIntPipe)id,
    @GetUser() user:User): Promise<void>{
        return this.boardsService.deleteBoard(id,user);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id',ParseIntPipe) id: number,
        @Body('status',BoardStatusValidationPipe) status: BoardStatus
    ){
        return this.boardsService.updateBoardStatus(id,status)
    }
}
