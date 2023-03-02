import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateFertilizerDto } from './dto/create-button.dto';
import { Request } from 'express';
import { FertilizerService } from './fertilizer.service';
import { FertilizerEntity } from './fertilizer.entity';

@Controller('fertilizer')
@UseGuards(AccessTokenGuard)
export class FertilizerController {
    constructor(private fertilizerService : FertilizerService){ }

    @Get()
    getAllFertilizer(
        @Req() req: Request
    ):Promise<FertilizerEntity[]>{
        return this.fertilizerService.getAllFertilizer(req.user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createFertilizerButton(@Body() createFertilizerDto : CreateFertilizerDto,
    @Req() req:Request) : Promise<FertilizerEntity>{
        return this.fertilizerService.createFertilizerButton(createFertilizerDto,req.user);
    }

    @Delete('/:id')
    deleteFertilizer(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.fertilizerService.deleteFertilizer(id);
    }

    @Put('/:id')
    update(@Param('id')id:number,@Body()fertilizerEntity:FertilizerEntity){
        return this.fertilizerService.update(id,fertilizerEntity);
    }
}