import { Fertilizer_mService } from './fertilizer_manually/fertilizer_m.service';
import { Fertilizer_m } from './fertilizer_manually/fertilizer_m.entity';
import { AccessTokenGuard } from 'src/auth/guard/accessToken.guard';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreateFertilizerDto } from './dto/create-button.dto';
import { Request } from 'express';
import { FertilizerService } from './fertilizer_basic/fertilizer.service';
import { FertilizerEntity } from './fertilizer_basic/fertilizer.entity';
import { Create_mButtonDto } from './dto/create-mbutton.dto';

@Controller('fertilizer')
@UseGuards(AccessTokenGuard)
export class FertilizerController {
    constructor(private fertilizerService : FertilizerService,
                private fertilizer_mService : Fertilizer_mService
        ){ }

    @Get()
    getAllFertilizer(
        @Req() req: Request
    ):Promise<FertilizerEntity[]>{
        return this.fertilizerService.getAllFertilizer(req.user);
    }

    @Get('manually')
    getAllManually(
        @Req() req:Request
    ):Promise<Fertilizer_m[]>{
        return this.fertilizer_mService.getuserAll_m(req.user);
    }

    @Post('manually')
    @UsePipes(ValidationPipe)
    createIrrigation_m(@Body() create_mButtondto:Create_mButtonDto,
    @Req() req:Request):Promise<Fertilizer_m>{
        return this.fertilizer_mService.createIrrigation_m(create_mButtondto,req.user);
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

    @Patch('/:id')
    update(@Param('id')id:number,@Body()fertilizerEntity:FertilizerEntity){
        return this.fertilizerService.update(id,fertilizerEntity);
    }
    @Patch(':id/manually')
    update_manually(@Param('id')id:number,@Body()fertilizer_m:Fertilizer_m){
        return this.fertilizer_mService.update_manually(id,fertilizer_m);
    }
}