import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceRepository } from "./device.repository";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { DeviceEntity } from "./device.entity";

@Injectable()
export class DeviceService {
    constructor(
        @InjectRepository(DeviceRepository)
        private deviceRepository : DeviceRepository,
    ){}
    createDevice(createDeviceDto : CreateDeviceDto,user:{[key : string]:any}):Promise<DeviceEntity>{
        return this.deviceRepository.createDevice(createDeviceDto,user);
    }
}