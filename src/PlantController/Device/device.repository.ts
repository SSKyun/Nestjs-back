import { Injectable } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { DataSource, Repository } from "typeorm";
import { DeviceEntity } from "./device.entity";
import { CreateDeviceDto } from "./dto/create-device.dto";

@Injectable()
export class DeviceRepository extends Repository<DeviceEntity>{
    constructor(private dataSource : DataSource){
        super(DeviceEntity,dataSource.createEntityManager());
    }
    async createDevice(createDeviceDto:CreateDeviceDto,user:{[key:string]:any}):Promise<DeviceEntity>{
        const user1 = await User.findOneBy({id:user['sub']});
        const { epump,etime,wpump,wtime1,wval1,wval2,wtime2,cval1,
        cval2,ctime} = createDeviceDto;
        const device = this.create({
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
        await this.save(device)
        return device;
    }
}