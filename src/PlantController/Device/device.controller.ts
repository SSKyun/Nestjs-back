import { Body, Controller, Post, Req, UseGuards, UsePipes } from "@nestjs/common";
import { AccessTokenGuard } from "src/auth/guard/accessToken.guard";
import { DeviceService } from "./device.service";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { DeviceEntity } from "./device.entity"
import { Request } from "express";

@Controller('device')
@UseGuards(AccessTokenGuard)
export class DeviceController {
    constructor(private deviceService : DeviceService){}

    @Post()
    createDevice(@Body() createDeviceDto : CreateDeviceDto,
    @Req() req:Request): Promise<DeviceEntity>{
        return this.deviceService.createDevice(createDeviceDto,req.user);
    }
}