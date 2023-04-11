import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards,Delete } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guard/accessToken.guard";
import { ManualService } from "./manual.service";
import { CreateManualDto } from "./dto/create-manual.dto";
import { Request } from "express";
import { Manual_Entity } from "./manual.entity";

@Controller('manual')
@UseGuards(AccessTokenGuard)
export class ManualController {
    constructor(private manualService:ManualService){}

    @Get()
    getAllManual():Promise<Manual_Entity[]>{
        return this.manualService.getAllManuals();
    }

    @Post()
    createManual(@Body() createManualDto:CreateManualDto,
    @Req() req:Request) : Promise<Manual_Entity>{
        return this.manualService.createManual(createManualDto,req.user);
    }

    @Patch(':id')
    update(@Param('id')id:number,@Body()manual:Manual_Entity){
        return this.manualService.update(id,manual);
    }

    @Delete(':id')
    deleteEnvir(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.manualService.deleteManual(id);
    }
}
