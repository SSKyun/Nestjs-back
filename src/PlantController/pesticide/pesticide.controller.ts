import { AccessTokenGuard } from '../../auth/guard/accessToken.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePesticideDto } from "./dto/create-button.dto";
import { PesticideEntity } from "./pesticide.entity";
import { PesticideService } from "./pesticide.service";
import { Request } from 'express';

@Controller('pesticide')
@UseGuards(AccessTokenGuard)
export class PesticideController {
    constructor(private pesticideService : PesticideService){}

    @Get()
    getAllPestiCide(
        @Req() req : Request
    ):Promise<PesticideEntity[]>{
        return this.pesticideService.getAllpesticide(req.user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createPesticideButton(@Body() createPesticideDto:CreatePesticideDto,
    @Req() req:Request): Promise<PesticideEntity>{
        return this.pesticideService.createPesticideButton(createPesticideDto,req.user);
    }

    @Delete('/:id')
    deletePesticide(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.pesticideService.deletePesticide(id);
    }

    @Put('/:id')
    update(@Param('id')id:number, @Body()pesticideEntity:PesticideEntity){
        return this.pesticideService.update(id,pesticideEntity);
    }
}