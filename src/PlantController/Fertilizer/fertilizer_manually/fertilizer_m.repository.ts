import { Fertilizer_m } from './fertilizer_m.entity';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Create_mButtonDto } from '../dto/create-mbutton.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class Fertilizer_mRepository extends Repository<Fertilizer_m>{
    constructor(private dataSource:DataSource){
        super(Fertilizer_m,dataSource.createEntityManager());
    }
    async createIrrigation_m(create_mButtonDto:Create_mButtonDto,user:{[key:string]:any}):Promise<Fertilizer_m>{
        const user2 = await User.findOneBy({id: user['sub']});
        const {manually_btn,manually_time} = create_mButtonDto;

        const irrigation = this.create({
            manually_btn,
            manually_time,
            user : user2
        })
        await this.save(irrigation);
        return irrigation;
    }
}