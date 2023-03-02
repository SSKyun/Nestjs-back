import { AccessTokenGuard } from './../auth/guard/accessToken.guard';
import { User } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardsService } from './boards.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe, UseGuards, Logger, Req } from '@nestjs/common';
import {BoardStatus} from './board-status.enum';
import { Board } from './board.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Request } from 'express';

@Controller('boards')
@UseGuards(AccessTokenGuard)
export class BoardsController {
    private logger = new Logger('Boards');
    constructor(private boardsService: BoardsService) { }

    @Get()
    getAllBoard(
        @GetUser() user: User
    ): Promise<Board[]> {
        //this.logger.verbose(`User ${user.username} trying to get all boards`);
        return this.boardsService.getAllBoards();
    }

    @Post()
    @UsePipes(ValidationPipe)
    createBoard(@Body() createBoardDto: CreateBoardDto,
    @Req() req: Request): Promise<Board> {
        // this.logger.verbose(`User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)} `)
        return this.boardsService.createBoard(createBoardDto, req.user);
    }

    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    // @Delete('/:id')
    // deleteBoard(@Param('id', ParseIntPipe) id,
    // @Req() req : Request
    // ): Promise<void> {
    //     return this.boardsService.deleteBoard(id, req.user);
    // } 해당 유저만 삭제 가능하게.

    @Delete('/:id')
    deleteBoard(@Param('id',ParseIntPipe)id:number):Promise<void> {
        return this.boardsService.deleteBoard2(id);
    }

    @Patch('/:id/status')
    updateBoardStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', BoardStatusValidationPipe) status: BoardStatus
    ) {
        return this.boardsService.updateBoardStatus(id, status);
    }
}