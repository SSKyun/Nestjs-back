import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, Repository } from "typeorm";
import { Device_Stat_Entity } from "./device.entity";
import { CreateDeviceDto } from "./dto/create-device.dto";

@Injectable()
export class DeviceRepository extends Repository<Device_Stat_Entity>{
    constructor(private dataSource : DataSource){
        super(Device_Stat_Entity,dataSource.createEntityManager());
    }
    async createDevice(createDeviceDto:CreateDeviceDto,user:{[key:string]:any}):Promise<Device_Stat_Entity>{
        const user1 = await User.findOneBy({id:user['sub']});
        const { device,epump,etime,wpump,wtime1,wval1,wval2,wtime2,cval1,
        cval2,ctime} = createDeviceDto;
        const DeviceData = this.create({
            device,
            user : user1,
            epump,
            etime,
            wpump,
            wtime1,
            wval1,
            wval2,
            wtime2,
            cval1,
            cval2,
            ctime
        });
        await this.save(DeviceData)
        return DeviceData;
    }
}