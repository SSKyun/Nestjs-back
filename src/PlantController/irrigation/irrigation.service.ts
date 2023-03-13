import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrrigationEntity } from './irrigation.entity';
import { CreateButtonDto } from './dto/create-button.dto';
import { Request } from 'express';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IrrigationRepository } from './irrigation.repository';
import { connect } from 'node-nats-streaming';

@Injectable()
export class IrrigationService {
  private natsClient: any;

  constructor(
    @InjectRepository(IrrigationRepository)
    private irrigationRepository: IrrigationRepository,
  ) {
    this.connectNats();
  }

  async connectNats() {
    this.natsClient = connect('cluster-name', 'client-id', {
      url: 'nats://localhost:8000',
    });
    this.natsClient.on('connect', () => {
      console.log('Connected to NATS');
    });
    this.natsClient.on('error', (err: any) => {
      console.log(`NATS error: ${err}`);
    });
  }

  // async incrementOnTime() {
  //   const irrigationEntities = await this.irrigationRepository.find();
  //   for (const entity of irrigationEntities) {
  //     if (entity.onoff) {
  //       entity.on_time = entity.on_time + 1;
  //       await this.irrigationRepository.update(entity.id, entity);
  //     }
  //   }
  // }

  async getAllButtons(
    user: { [key: string]: any },
  ): Promise<IrrigationEntity[]> {
    const query = this.irrigationRepository.createQueryBuilder('irrigation');
    query.where('irrigation.userId = :userId', { userId: user['sub'] });
    const buttons = await query.getMany();
    return buttons;
  }

  createIrrigationButton(
    createButtonDto: CreateButtonDto,
    user: { [key: string]: any },
  ): Promise<IrrigationEntity> {
    return this.irrigationRepository.createIrrigationButton(createButtonDto, user);
  }

  async deleteIrrigation(id: number): Promise<void> {
    const result = await this.irrigationRepository.delete(id);
    console.log('result', result);
  }
  async update(id: number, irrigationEntity: IrrigationEntity): Promise<void> {
    try {
      const update = await this.irrigationRepository.findOneBy({ id });
      if (!update) {
        throw new Error('IrrigationEntity not found');
      }
  
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
        update.onoff = irrigationEntity.onoff;
        const message = {
          id: update.id,
          set_time: update.set_time,
          onoff: update.onoff,
        };
        this.natsClient.publish('irrigation', JSON.stringify(message));
        this.startTimer(update); // startTimer() 함수 호출
      } else if (irrigationEntity.onoff === false && irrigationEntity.set_time >= 0) {
        update.set_time = 0;
        update.onoff = irrigationEntity.onoff;
      } else if (irrigationEntity.onoff === true && irrigationEntity.set_time <= 0) {
        update.onoff = false;
        update.set_time = 0;
        update.on_time = update.on_time + 1;
      }
      await this.irrigationRepository.save(update);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update IrrigationEntity');
    }
  }
  
  private startTimer(entity: IrrigationEntity) {
    
    let intervalId = setInterval(async () => {
      const updatedEntity = await this.irrigationRepository.findOneBy({ id: entity.id });
      if (updatedEntity.onoff) {
        if (updatedEntity.set_time > 0) {
          updatedEntity.set_time = updatedEntity.set_time - 1;
          updatedEntity.on_time = updatedEntity.on_time + 1;
          await this.irrigationRepository.update(entity.id, updatedEntity);
          const message = {
            id: updatedEntity.id,
            set_time: updatedEntity.set_time,
            onoff: updatedEntity.onoff,
          };
          this.natsClient.publish('irrigation', JSON.stringify(message));
        } else {
          updatedEntity.onoff = false;
          await this.irrigationRepository.update(entity.id, updatedEntity);
          const message = {
            id: updatedEntity.id,
            onoff: updatedEntity.onoff,
            };
            this.natsClient.publish('irrigation', JSON.stringify(message));
          }
        } else {
            clearInterval(intervalId);
          }
      }, 60 * 1000);
  }
}