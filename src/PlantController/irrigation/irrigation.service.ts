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
      this.startSchedule();
    });
    this.natsClient.on('error', (err: any) => {
      console.log(`NATS error: ${err}`);
    });
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

  async startSchedule() {
    const irrigations = await this.irrigationRepository.find();
    for (const irrigation of irrigations) {
      const daysOfWeek = [
        irrigation.sun_day,
        irrigation.mon_day,
        irrigation.tue_day,
        irrigation.wed_day,
        irrigation.thu_day,
        irrigation.fri_day,
        irrigation.sat_day,
      ];
      const onTime = irrigation.on_time;
      const setTime = irrigation.set_time;
      const line1 = irrigation.line_1;
      const line2 = irrigation.line_2;
      const line3 = irrigation.line_3;
      const startHour = irrigation.s_hour;
      const startMinute = irrigation.s_min;
      let onoff = irrigation.onoff !== undefined ? irrigation.onoff : false; // onoff값 초기화
      let accumulatedTime = irrigation.onoff ? irrigation.on_time : 0; // 총 작동 시간 초기화

      // intervalId를 irrigation 객체에 저장합니다.
      irrigation.intervalId = setInterval(() => {
        const now = new Date();
        const currentDay = now.getDay();
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0, 0);
        if (daysOfWeek[currentDay] && now >= startTime) {
          const end = new Date(startTime.getTime() + onTime * 60 * 1000);
          const duration = setTime * 60 * 1000;

          const job = () => {
            console.log("job 호출")
            if (onoff === false || accumulatedTime >= 0) { // 양수인 경우에만 작동
              onoff = true;
              const message = {
                id: irrigation.id,
                line1,
                line2,
                line3,
                onoff,
              };
              this.natsClient.publish('irrigation', JSON.stringify(message));
              accumulatedTime += onTime;
              irrigation.accumulatedTime = accumulatedTime; // accumulatedTime으로 저장합니다.
              this.irrigationRepository.save(irrigation);
              console.log('onoff 값이 변경되었습니다. 현재 값:', onoff);
            } else {
              onoff = false;
              const message = {
                id: irrigation.id,
                line1,
                line2,
                line3,
                onoff,
              };
              console.log('onoff 값이 변경되었습니다. 현재 값:', onoff);
              this.natsClient.publish('irrigation', JSON.stringify(message));
            }
          }

          // duration 마다 job 함수를 실행합니다.
          const intervalId = setInterval(() => {
            job();
            if (accumulatedTime >= duration) {
              clearInterval(intervalId); // duration 이후 interval을 멈춥니다.
            }
          }, 30 * 1000);

          // 30초 간격으로 job 함수를 실행합니다.
          setInterval(() => {
            job();
          }, 30 * 1000);

        } else {
          clearInterval(irrigation.intervalId); // 해당 irrigation의 interval을 멈춥니다.
          irrigation.intervalId = null; // intervalId를 초기화합니다.
          irrigation.accumulatedTime = 0;
        }
      }, 1000);
    }
  }
  async stopSchedule(id: number) {
    const irrigation = await this.irrigationRepository.findOneBy({id});
    if (irrigation && irrigation.intervalId !== null) {
    clearInterval(irrigation.intervalId);
    irrigation.intervalId = null;
    irrigation.onoff = false;
    irrigation.accumulatedTime = 0;
    await this.irrigationRepository.save(irrigation);
    }
  }
}