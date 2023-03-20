import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IrrigationEntity } from './irrigation.entity';
import { CreateButtonDto } from './dto/create-button.dto';
import { Request } from 'express';
import { firstValueFrom, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IrrigationRepository } from './irrigation.repository';
import { connect, Stan } from 'node-nats-streaming';

@Injectable()
export class IrrigationService {
  private readonly logger = new Logger(IrrigationService.name);
  private natsClient: Stan;

  constructor(
    @InjectRepository(IrrigationRepository)
    private irrigationRepository: IrrigationRepository,
  ) {
    this.natsClient = null;
    this.connectNats();
  }

  async connectNats() {
    const clusterId = 'cluster-name';
    const clientId = 'client-id';
    const natsUrl = 'http://localhost:8000';
  
    try {
      this.natsClient = await connect(clusterId, clientId, { url: natsUrl });
      console.log(`Connected to NATS at ${natsUrl}`);
      this.startSchedule();
      this.natsClient.on('close', () => {
        console.log(`Disconnected from NATS at ${natsUrl}`);
        process.exit(1);
      });
    } catch (err) {
      console.error(`NATS error: ${err}`);
      process.exit(1);
    }
  }

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

  async update_manually(id: number, irrigationEntity: IrrigationEntity): Promise<void> {
    const update = await this.irrigationRepository.findOneBy({ id });
    update.manually_time = irrigationEntity.manually_time;
    update.manually_btn = irrigationEntity.manually_btn;
  
    await this.irrigationRepository.save(update);
  
    const interval = setInterval(async () => {
      try {
        console.log("interval 작동");
        if (update.manually_time > 0 && update.manually_btn === true) {
          await this.natsClient.publish('irrigation.button.update', JSON.stringify({id, accumulated_time: (update.accumulated_time ?? 0) + 1}));
          update.accumulated_time = (update.accumulated_time ?? 0) + 1;
          update.manually_time--;
          await this.irrigationRepository.save(update);
        } else {
          update.manually_time = 0;
          await this.irrigationRepository.save(update);
          await this.natsClient.publish('irrigation.button.update', JSON.stringify({id, manually_btn: false}));
          clearInterval(interval);
        }
      } catch (error) {
        console.error(`update_manually 실행 중 에러: ${error}`);
      }
    }, 60000);
  }

  async update(id:number,irrigationentity:IrrigationEntity):Promise<void>{
    const update = await this.irrigationRepository.findOneBy({id});
    update.sun_day = irrigationentity.sun_day;
    update.mon_day = irrigationentity.mon_day;
    update.tue_day = irrigationentity.tue_day;
    update.wed_day = irrigationentity.wed_day;
    update.thu_day = irrigationentity.thu_day;
    update.fri_day = irrigationentity.fri_day;
    update.sat_day = irrigationentity.sat_day;
    update.s_hour = irrigationentity.s_hour;
    update.s_min = irrigationentity.s_min;
    update.schedule_btn = irrigationentity.schedule_btn;
    update.line_1 = irrigationentity.line_1;
    update.line_2 = irrigationentity.line_2;
    update.line_3 = irrigationentity.line_3;
    update.onoff = irrigationentity.onoff;
    update.set_time = irrigationentity.set_time;
    update.accumulated_time = irrigationentity.accumulated_time

    await this.irrigationRepository.save(update);
  }

  

  async startSchedule() {
  try {
    while (true) {
      const now = new Date();
      const utcHour = now.getUTCHours();
      const kstHour = utcHour + 9;
      const currentDayOfWeek = now.getUTCDay();
      const currentHour = kstHour < 24 ? kstHour : kstHour - 24;
      const currentMinute = now.getUTCMinutes();

      const irrigations = await this.irrigationRepository.find();
      const irrigationsToSchedule = irrigations.filter((irrigation) => irrigation.schedule_btn);
      // schedule_btn이 true면 사용자가 스케쥴을 사용하겠다고 표시해준거임.
      for (const irrigation of irrigationsToSchedule) {
        const daysOfWeek = [
          irrigation.sun_day,
          irrigation.mon_day,
          irrigation.tue_day,
          irrigation.wed_day,
          irrigation.thu_day,
          irrigation.fri_day,
          irrigation.sat_day,
        ];
        const setTime = irrigation.set_time;
        const line1 = irrigation.line_1;
        const line2 = irrigation.line_2;
        const line3 = irrigation.line_3;
        const startHour: number = Number(irrigation.s_hour);
        const startMinute: number = Number(irrigation.s_min);
        let onoff = irrigation.onoff || false;
        let accumulatedTime = irrigation.accumulated_time || 0;

        if (
          daysOfWeek[currentDayOfWeek] &&
          currentHour === startHour &&
          currentMinute === startMinute &&
          !onoff
        ) {
          console.log(`Starting irrigation ${irrigation.id}`);
          // TODO: 라즈베리파이 GPIO를 이용하여 라인 출력
          onoff = true;
          irrigation.onoff = onoff;
          irrigation.accumulated_time = accumulatedTime;
          await this.irrigationRepository.save(irrigation);
          console.log(`onoff is now ${onoff}`);
        }
        
        if (onoff && accumulatedTime >= setTime) {
          console.log(`Stopping irrigation ${irrigation.id}`);
          // TODO: 라즈베리파이 GPIO를 이용하여 라인 정지
          onoff = false;
          irrigation.onoff = onoff;
          await this.irrigationRepository.save(irrigation);
          console.log(`onoff is now ${onoff}`);
          accumulatedTime = 0;
        }
        
        if (onoff) {
          accumulatedTime++;
          irrigation.accumulated_time = accumulatedTime;
          await this.irrigationRepository.save(irrigation);
        }

        if(onoff === false){
          console.log(`${currentHour}:${currentMinute} 현재시간`)
          console.log(`${irrigation.s_hour}:${startMinute}_${setTime} 저장시간`)
        }
      }

      await firstValueFrom(timer(60000))
    }
  } catch (error) {
    console.error(`startSchedule 실행중 에러: ${error}`);
  }
}
}