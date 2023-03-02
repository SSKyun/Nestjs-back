import { User } from 'src/auth/user.entity';
import { IrrigationRepository } from './irrigation.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateButtonDto } from './dto/create-button.dto';
import { IrrigationEntity } from './irrigation.entity';
import { Request } from 'express';

@Injectable()
export class IrrigationService {
    constructor(
        @InjectRepository(IrrigationRepository)
        private irrigationRepository : IrrigationRepository,
    ){}

    async getAllButtons(
        user:{[key : string] : any}
    ): Promise<IrrigationEntity[]>{
        const query = this.irrigationRepository.createQueryBuilder('irrigation');
        query.where('irrigation.userId = :userId',{userId : user['sub']});
        const buttons = await query.getMany();
        return buttons;
    }

    createIrrigationButton(createButtonDto : CreateButtonDto,user:{[key : string] : any}) : Promise<IrrigationEntity>{
        return this.irrigationRepository.createIrrigationButton(createButtonDto,user);
    }

    async  deleteIrrigation(id:number):Promise<void>{
        const result = await this.irrigationRepository.delete(id);
        console.log('result',result);
    }

    async update(id:number,irrigationEntity:IrrigationEntity):Promise<void>{
        const update = await this.irrigationRepository.findOneBy({id});
        update.sun_day = irrigationEntity.sun_day;
        update.mon_day = irrigationEntity.mon_day;
        update.tue_day = irrigationEntity.tue_day;
        update.wed_day = irrigationEntity.wed_day;
        update.thu_day = irrigationEntity.thu_day;
        update.fri_day = irrigationEntity.fri_day;
        update.sat_day = irrigationEntity.sat_day;
        update.s_hour = irrigationEntity.s_hour;
        update.s_min = irrigationEntity.s_min;
        update.on_time = irrigationEntity.on_time;
        update.line_1 = irrigationEntity.line_1;
        update.line_2 = irrigationEntity.line_2;
        update.line_3 = irrigationEntity.line_3;
        update.onoff = irrigationEntity.onoff;

        await this.irrigationRepository.save(update);
    }
}
