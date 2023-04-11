import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards, UsePipes, Delete, ParseIntPipe } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guard/accessToken.guard";
import { DeviceService } from "./device.service";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { DeviceEntity } from "./device.entity"
import { Request } from "express";

@Controller('device') // machine_stat도 만들어줘야 됌.
@UseGuards(AccessTokenGuard)
export class DeviceController {
    constructor(private deviceService : DeviceService){}

    @Post() // 디바이스 등록. 
    createDevice(@Body() createDeviceDto : CreateDeviceDto,
    @Req() req:Request): Promise<DeviceEntity>{
        return this.deviceService.createDevice(createDeviceDto,req.user);
    }

    @Get()
    getAllDevice(@Req() req:Request):Promise<DeviceEntity[]>{
        return this.deviceService.getAllDevices(req.user);
    }

    @Patch(':id')
    update(@Param('id')id:number,@Body()deviceEntity:DeviceEntity){
        return this.deviceService.update(id,deviceEntity);
    }

    @Delete(':id')
    deleteDevice(@Param('id',ParseIntPipe)id:number):Promise<void>{
        return this.deviceService.deleteDevice(id);
    }
}