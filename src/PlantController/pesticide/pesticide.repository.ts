import { User } from '../../auth/user.entity';
import { PesticideEntity } from './pesticide.entity';
import { Repository, DataSource } from 'typeorm';
import { CreatePesticideDto } from './dto/create-button.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PesticideRepository extends Repository<PesticideEntity>{
    constructor(private dataSource : DataSource){
        super(PesticideEntity, dataSource.createEntityManager());
    }
    async createPesticideButton(createPesticideDto : CreatePesticideDto, user:{[key:string]:any}):Promise<PesticideEntity>{
        const user1 = await User.findOneBy({id : user['sub']});
        const {s_hour,s_min,on_time,line_1,line_2,line_3,onoff,
            sun_day,mon_day,tue_day,wed_day,thu_day,fri_day,sat_day,} = createPesticideDto;

        const pesticideButton = this.create({
            sun_day,mon_day,tue_day,wed_day,thu_day,fri_day,sat_day, //요일
            s_hour,
            s_min,
            on_time,
            line_1,
            line_2,
            line_3,
            onoff,
            user : user1
        })

        await this.save(pesticideButton);
        return pesticideButton;
    }
}