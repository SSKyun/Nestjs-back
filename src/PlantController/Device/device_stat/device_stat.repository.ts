import { Create_Device_statDto } from './../dto/create-device_stat.dto';
import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Device_stat_Entity } from "./device_stat.entity";

@Injectable()
export class Device_statRepository extends Repository<Device_stat_Entity>{
    constructor(private dataSource:DataSource){
        super(Device_stat_Entity,dataSource.createEntityManager());
    }
    // async createDevice_stat(create_Device_statDto:Create_Device_statDto,
    //     user:{[key:string]:any}):Promise<Device_stat_Entity>{
    //         const m_number = await 
    //     }
}