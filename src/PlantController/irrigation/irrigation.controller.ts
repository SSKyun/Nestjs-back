import { AuthGuard } from '@nestjs/passport';
import { IrrigationEntity } from './irrigation.entity';
import { CreateButtonDto } from './dto/create-button.dto';
import { IrrigationService } from './irrigation.service';
import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Request } from 'express';
import { Delete, Param, Patch, Put } from '@nestjs/common/decorators';

@Controller('irrigation')
@UseGuards(AccessTokenGuard)
export class IrrigationController {
    constructor(private irrigationService: IrrigationService) { }

    @Get()
    getAllButton(
        @Req() req : Request
    ): Promise<IrrigationEntity[]>{
        return this.irrigationService.getAllButtons(req.user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createIrrigationButton(@Body() createbuttonDto: CreateButtonDto,
    @Req() req:Request): Promise<IrrigationEntity>{
        return this.irrigationService.createIrrigationButton(createbuttonDto, req.user);
    }

    @Delete('/:id')
    deleteIrrigation(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.irrigationService.deleteIrrigation(id);
    }

    @Put('/:id')
    update(@Param('id')id:number,@Body()irrigationEntity:IrrigationEntity){
        return this.irrigationService.update(id,irrigationEntity);
    }
}
