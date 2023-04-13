import { CreateManualDto } from './dto/create-manual.dto';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Manual_Entity } from './manual.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ManualRepository extends Repository<Manual_Entity>{
    constructor(private dataSource:DataSource){
        super(Manual_Entity, dataSource.createEntityManager());
    }
    async createManual(createManualDto:CreateManualDto,user:{[key:string]:any}):Promise<Manual_Entity>{
        const user0 = await User.findOneBy({id:user['sub']});
        const {device,rwtime1,rwtime2,rcval1,rcval2,rctime} = createManualDto;
        const manual = this.create({
            device,
            rwtime1,
            rwtime2,
            rcval1,
            rcval2,
            rctime,
            user : user0
        })
        await this.save(manual);
        return manual;
    }
}