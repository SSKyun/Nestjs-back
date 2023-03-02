import { CreateFertilizerDto } from './dto/create-button.dto';
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { FertilizerEntity } from './fertilizer.entity';import { User } from 'src/auth/user.entity';
''
@Injectable()
export class FertilizerRepository extends Repository<FertilizerEntity>{
    constructor(private dataSource : DataSource){
        super(FertilizerEntity,dataSource.createEntityManager());
    }
    async createFertilizerButton(createFertilizerDto:CreateFertilizerDto,user:{[key:string]:any}):Promise<FertilizerEntity>{
        const user1 = await User.findOneBy({id : user['sub']});
        const {s_hour,s_min,on_time,line_1,line_2,line_3,onoff,
            sun_day,mon_day,tue_day,wed_day,thu_day,fri_day,sat_day,} = createFertilizerDto;

        const FertilizerButton = this.create({
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
        await this.save(FertilizerButton);
        return FertilizerButton;
    }
}