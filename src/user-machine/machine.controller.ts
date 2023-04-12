import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards,Delete, UsePipes, ValidationPipe } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guard/accessToken.guard";
import { Machine_Entity } from "./machine.entity";
import { CreateMachineDto } from "./dto/create-machine.dto";
import { Request } from "express";
import { MachineService } from "./machine.service";

@Controller('machine')
@UseGuards(AccessTokenGuard)
export class MachineController{
    constructor(private machineService : MachineService){}

    @Get()
    getAllMachine(
        @Req() req : Request
    ):Promise<Machine_Entity[]>{
        return this.machineService.getAllMachines(req.user);
    }

    @Post()
    createMachine(@Body() createMachineDto:CreateMachineDto,
    @Req() req:Request):Promise<Machine_Entity>{
        return this.machineService.createMachine(createMachineDto,req.user);
    }

    @Patch('/:id')
    update(@Param('id')id:number,@Body()machine:Machine_Entity){
        return this.machineService.update(id,machine);
    }

    @Delete('/:id')
    deleteMachine(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.machineService.deleteMachine(id);
    }

}