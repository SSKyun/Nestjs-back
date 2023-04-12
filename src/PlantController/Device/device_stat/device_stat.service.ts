import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Device_statRepository } from "./device_stat.repository";

@Injectable()
export class Device_statService{
    constructor(@InjectRepository(Device_statRepository)
    private device_statRepository : Device_statRepository){}

    
}