import { PesticideEntity } from './pesticide.entity';
import { CreatePesticideDto } from './dto/create-button.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { PesticideRepository } from "./pesticide.repository";
import { Injectable } from '@nestjs/common';

@Injectable()
export class PesticideService{
    constructor(
        @InjectRepository(PesticideRepository)
        private pesticideRepository : PesticideRepository,
    ){}

    async getAllpesticide(
        user:{[key:string]:any}
    ):Promise<PesticideEntity[]>{
        const query = this.pesticideRepository.createQueryBuilder('pesticide');
        query.where('pesticide.userId = :userId',{userId : user['sub']});
        const pesticide = await query.getMany();
        return pesticide;
    }

    createPesticideButton(createPesticideDto : CreatePesticideDto,user:{[key:string]:any}):Promise<PesticideEntity>{
        return this.pesticideRepository.createPesticideButton(createPesticideDto,user)
    }

    async deletePesticide(id:number):Promise<void>{
        const result = await this.pesticideRepository.delete(id);
        console.log('result',result);
    }

    async update(id:number,pesticideEntity:PesticideEntity):Promise<void>{
        const update = await this.pesticideRepository.findOneBy({id});
        update.sun_day = pesticideEntity.sun_day;
        update.mon_day = pesticideEntity.mon_day;
        update.tue_day = pesticideEntity.tue_day;
        update.wed_day = pesticideEntity.wed_day;
        update.thu_day = pesticideEntity.thu_day;
        update.fri_day = pesticideEntity.fri_day;
        update.sat_day = pesticideEntity.sat_day;
        update.s_hour = pesticideEntity.s_hour;
        update.s_min = pesticideEntity.s_min;
        update.on_time = pesticideEntity.on_time;
        update.line_1 = pesticideEntity.line_1;
        update.line_2 = pesticideEntity.line_2;
        update.line_3 = pesticideEntity.line_3;
        update.onoff = pesticideEntity.onoff;

        await this.pesticideRepository.save(update);
    }

}