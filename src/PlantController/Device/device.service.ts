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

    async getAllDevices(user:{[key:string]:any}):Promise<DeviceEntity[]>{
        const query = this.deviceRepository.createQueryBuilder('device');
        query.where('device.userId = :userId',{userId:user['sub']});
        const devices = await query.getMany();
        return devices;
    }

    createDevice(createDeviceDto : CreateDeviceDto,user:{[key : string]:any}):Promise<DeviceEntity>{
        return this.deviceRepository.createDevice(createDeviceDto,user);
    }

    async update(id:number,deviceEntity:DeviceEntity):Promise<void>{
        const update = await this.deviceRepository.findOneBy({id});
        update.device = deviceEntity.device;
        update.epump = deviceEntity.epump;
        update.etime = deviceEntity.etime;
        update.wpump = deviceEntity.wpump;
        update.wval1 = deviceEntity.wval1;
        update.wval2 = deviceEntity.wval2;
        update.wtime1 = deviceEntity.wtime1;
        update.wtime2 = deviceEntity.wtime2;
        update.cval1 = deviceEntity.cval1;
        update.cval2 = deviceEntity.cval2;
        update.ctime = deviceEntity.ctime;

        await this.deviceRepository.save(update);
    }

    async deleteDevice(id:number):Promise<void>{
        const result = await this.deviceRepository.delete(id);
    }
}