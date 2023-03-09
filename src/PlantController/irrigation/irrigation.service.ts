import { User } from 'src/auth/user.entity';
import { IrrigationRepository } from './irrigation.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateButtonDto } from './dto/create-button.dto';
import { IrrigationEntity } from './irrigation.entity';
import { Request } from 'express';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class IrrigationService {
    constructor(
        @InjectRepository(IrrigationRepository)
        private irrigationRepository : IrrigationRepository,
    ){}

    
    @Cron('0 * * * * *') // 매 분마다 실행
    async incrementOnTime() {
      const irrigationEntities = await this.irrigationRepository.find();
      for (const entity of irrigationEntities) {
        if (entity.onoff) {
          entity.on_time = entity.on_time + 1;
          await this.irrigationRepository.update(entity.id, entity);
        }
      }
    }

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
      try {
        const update = await this.irrigationRepository.findOneBy({id});
        if (update) {
          update.sun_day = irrigationEntity.sun_day;
          update.mon_day = irrigationEntity.mon_day;
          update.tue_day = irrigationEntity.tue_day;
          update.wed_day = irrigationEntity.wed_day;
          update.thu_day = irrigationEntity.thu_day;
          update.fri_day = irrigationEntity.fri_day;
          update.sat_day = irrigationEntity.sat_day;
          update.s_hour = irrigationEntity.s_hour;
          update.s_min = irrigationEntity.s_min;
          update.line_1 = irrigationEntity.line_1;
          update.line_2 = irrigationEntity.line_2;
          update.line_3 = irrigationEntity.line_3;
          update.onoff = irrigationEntity.onoff;
          
          if (irrigationEntity.onoff === true && irrigationEntity.set_time > 0) {
            update.set_time = irrigationEntity.set_time;
            setTimeout(async () => {
              update.onoff = false; // set_time 이후에 onoff 값을 false로 변경
              update.set_time = 0; // set_time 값을 0으로 초기화
              await this.irrigationRepository.save(update); // 변경된 데이터 저장
            }, irrigationEntity.set_time * 60 * 1000); // set_time 값을 밀리초로 변경하여 setTimeout 함수에 전달
          }else if (irrigationEntity.onoff === false && irrigationEntity.set_time >= 0) {
            update.set_time = irrigationEntity.set_time; //작동은 안하되 set_time 값은 증가.
          }else if(irrigationEntity.onoff === true && irrigationEntity.set_time <= 0){
            update.onoff = false; //set_time의 값이 없기 때문에 언제까지 반복해야 될지 모르기 때문에.
          }
          
          if (!update.onoff) {
            await this.irrigationRepository.save(update);
            return;
          }
          
          await this.irrigationRepository.save(update);
        } else {
          console.log(`id ${id}에 해당하는 레코드를 찾지 못했습니다.`);
        }
      } catch (error) {
        console.log(error); // 오류 로그 출력
      }
    }
}
