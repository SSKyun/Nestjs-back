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
    this.natsClient = null; // 선언만 하고 초기화는 connectNats() 메소드에서 처리
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
    try{
    console.log("startSchedule 실행중...")
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
      let onoff = irrigation.onoff || false; // 기본값 false
      let accumulatedTime = irrigation.accumulated_time || 0; // 기본값 0
    
      // 현재 시간을 기준으로 요일과 시간이 일치하고, onoff가 false인 경우 실행
      const now = new Date();
      const currentDayOfWeek = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
    
      if (
        daysOfWeek[currentDayOfWeek] &&
        currentHour === startHour &&
        currentMinute === startMinute &&
        !onoff
      ) {
        console.log(`Starting irrigation ${irrigation.id}`);
        // TODO: 라즈베리파이 GPIO를 이용하여 라인 출력
        onoff = true;
        irrigation.onoff = onoff; // 값 저장
        irrigation.accumulated_time = accumulatedTime;
        await this.irrigationRepository.save(irrigation);
      }
    
      if (onoff && accumulatedTime >= setTime) {
        console.log(`Stopping irrigation ${irrigation.id}`);
        // TODO: 라즈베리파이 GPIO를 이용하여 라인 정지
        onoff = false;
        irrigation.onoff = onoff;
        await this.irrigationRepository.save(irrigation); // await 키워드 추가
      }
  
      // 작동중인 경우 누적 시간 증가
      if (onoff) {
        accumulatedTime++;
        irrigation.accumulated_time = accumulatedTime;
        await this.irrigationRepository.save(irrigation); // await 키워드 추가
      }
    }
    }catch(error){
      console.error(`startSchedule 실행중 예외 발생 : ${error}`);
  }
}
}