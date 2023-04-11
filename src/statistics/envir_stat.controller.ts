import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, ParseIntPipe,Delete } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { EnvirService } from './envir_stat.service';
import { CreateEnvirDto } from './dto/create-envir.dto';
import { Request } from 'express';
import { Envir_Entity } from './envir_stat.entity';

@Controller('envir')
@UseGuards(AccessTokenGuard)
export class EnvirController{
    constructor(private envirService:EnvirService){}
    
    @Post()
    createEnvir(@Body()createEnvirDto:CreateEnvirDto,
    @Req() req:Request):Promise<Envir_Entity>{
        return this.envirService.createEnvir(createEnvirDto,req.user);
    }

    @Get()
    getAllEnvir(@Req()req:Request):Promise<Envir_Entity[]>{
        return this.envirService.getAllEnvir(req.user);
    }

    @Patch(':id')
    update(@Param('id')id:number,@Body()envir_Entity:Envir_Entity){
        return this.envirService.update(id,envir_Entity);
    }

    @Delete(':id')
    deleteEnvir(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.envirService.deleteEnvir(id);
    }
}