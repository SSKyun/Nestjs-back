import { CreateFertilizerDto } from '../dto/create-button.dto';
import { FertilizerRepository } from './fertilizer.repository';
import { InjectRepository } from "@nestjs/typeorm";
import { FertilizerEntity } from './fertilizer.entity';
import { Injectable } from '@nestjs/common';
import { connect, Stan } from 'node-nats-streaming';
import { firstValueFrom, timer } from 'rxjs';

@Injectable()
export class FertilizerService {
    private natsClient: Stan;

  constructor(
    @InjectRepository(FertilizerRepository)
    private fertilizerRepository: FertilizerRepository,
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
      console.log(`Connected to NATS at ${natsUrl} - fertilizer`);
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
        update.schedule_btn = fertilizerEntity.schedule_btn;
        update.line_1 = fertilizerEntity.line_1;
        update.line_2 = fertilizerEntity.line_2;
        update.line_3 = fertilizerEntity.line_3;
        update.onoff = fertilizerEntity.onoff;
        update.set_time = fertilizerEntity.set_time;
        update.accumulated_time = fertilizerEntity.accumulated_time

        await this.fertilizerRepository.save(update);
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
      
            const fertilizer = await this.fertilizerRepository.find();
            const fertilizerToSchedule = fertilizer.filter((fertilizer) => fertilizer.schedule_btn);
            // schedule_btn이 true면 사용자가 스케쥴을 사용하겠다고 표시해준거임.
            for (const fertilizer of fertilizerToSchedule) {
              const daysOfWeek = [
                fertilizer.sun_day,
                fertilizer.mon_day,
                fertilizer.tue_day,
                fertilizer.wed_day,
                fertilizer.thu_day,
                fertilizer.fri_day,
                fertilizer.sat_day,
              ];
              let Count = fertilizer.Count;
              const setTime = fertilizer.set_time;
              const line1 = fertilizer.line_1;
              const line2 = fertilizer.line_2;
              const line3 = fertilizer.line_3;
              const startHour: number = Number(fertilizer.s_hour);
              const startMinute: number = Number(fertilizer.s_min);
              let onoff = fertilizer.onoff || false;
              let accumulatedTime = fertilizer.accumulated_time;
              
      
              if (
                daysOfWeek[currentDayOfWeek] &&
                currentHour === startHour &&
                currentMinute === startMinute &&
                !onoff
              ) {
                
                console.log(`Starting fertilizer ${fertilizer.id}`);
                // TODO: 라즈베리파이 GPIO를 이용하여 라인 출력
                onoff = true;
                fertilizer.onoff = onoff;
                fertilizer.accumulated_time = accumulatedTime;
                await this.fertilizerRepository.save(fertilizer);
                console.log(`onoff is now ${onoff}`);
              }
              
              if (onoff && Count === setTime) {
                console.log(`Stopping fertilizer ${fertilizer.id}`);
                // TODO: 라즈베리파이 GPIO를 이용하여 라인 정지
                onoff = false;
                fertilizer.onoff = onoff;
                Count = 0;
                fertilizer.Count = Count
                await this.fertilizerRepository.save(fertilizer);
                console.log(`onoff is now ${onoff}`);
                
              }
              
              if (onoff) {
                accumulatedTime++;
                Count++;
                console.log(Count);
                fertilizer.Count = Count;
                fertilizer.accumulated_time = accumulatedTime;
                await this.fertilizerRepository.save(fertilizer);
              }
      
              if(onoff === false){
                // console.log(`${currentHour}:${currentMinute} 현재시간`)
                // console.log(`${fertilizer.s_hour}:${startMinute}_${setTime} 저장시간`)
              }
            }
      
            await firstValueFrom(timer(60000))
          }
        } catch (error) {
          console.error(`startSchedule 실행중 에러: ${error}`);
        }
      }
}