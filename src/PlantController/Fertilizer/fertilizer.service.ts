import { CreateFertilizerDto } from './dto/create-button.dto';
import { FertilizerRepository } from './fertilizer.repository';
import { InjectRepository } from "@nestjs/typeorm";
import { FertilizerEntity } from './fertilizer.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FertilizerService {
    constructor(
        @InjectRepository(FertilizerRepository)
        private fertilizerRepository : FertilizerRepository,
    ){}

    async getAllFertilizer(
        user:{[key:string]:any}
    ):Promise<FertilizerEntity[]>{
        const query = this.fertilizerRepository.createQueryBuilder('fertilizer');
        query.where('fertilizer.userId = :userId',{userId : user['sub']});
        const fertilizer = await query.getMany();
        return fertilizer;
    }

    createFertilizerButton(createFertilizerDto:CreateFertilizerDto,user:{[key:string]:any}):Promise<FertilizerEntity>{
        return this.fertilizerRepository.createFertilizerButton(createFertilizerDto,user);
    }

    async deleteFertilizer(id:number):Promise<void>{
        const result = await this.fertilizerRepository.delete(id);
    }

    async update(id:number,fertilizerEntity:FertilizerEntity):Promise<void>{
        const update = await this.fertilizerRepository.findOneBy({id});
        update.sun_day = fertilizerEntity.sun_day;
        update.mon_day = fertilizerEntity.mon_day;
        update.tue_day = fertilizerEntity.tue_day;
        update.wed_day = fertilizerEntity.wed_day;
        update.thu_day = fertilizerEntity.thu_day;
        update.fri_day = fertilizerEntity.fri_day;
        update.sat_day = fertilizerEntity.sat_day;
        update.s_hour = fertilizerEntity.s_hour;
        update.s_min = fertilizerEntity.s_min;
        update.on_time = fertilizerEntity.on_time;
        update.line_1 = fertilizerEntity.line_1;
        update.line_2 = fertilizerEntity.line_2;
        update.line_3 = fertilizerEntity.line_3;
        update.onoff = fertilizerEntity.onoff;

        await this.fertilizerRepository.save(update);
    }
}