import { ManualService } from './../Manual_controler/manual.service';
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeviceRepository } from "./device.repository";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { Device_Stat_Entity } from "./device.entity";
import { MqttClient, connect } from "mqtt";

@Injectable()
export class DeviceService{
    private client: MqttClient;
    constructor(
        @InjectRepository(DeviceRepository)
        private deviceRepository : DeviceRepository,
        // private manualService : ManualService
    ){}
    

    async testFunction(){
        // this.client.on('connect',()=>{
        //     this.client.subscribe('test2',(err)=>{
        //         if(err){
        //             console.log(`error`,err);
        //         }else{
        //             console.log('device subscribed to test2');
        //         }
        //     })
        // })
    }

    async getAllDevices(user:{[key:string]:any}):Promise<Device_Stat_Entity[]>{
        const query = this.deviceRepository.createQueryBuilder('device');
        query.where('device.userId = :userId',{userId:user['sub']});
        const devices = await query.getMany();
        return devices;
    }

    createDevice(createDeviceDto : CreateDeviceDto,user:{[key : string]:any}):Promise<Device_Stat_Entity>{
        return this.deviceRepository.createDevice(createDeviceDto,user);
    }

    async update(id:number,deviceEntity:Device_Stat_Entity):Promise<void>{
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