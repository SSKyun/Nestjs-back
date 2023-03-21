import { PesticideEntity } from './pesticide.entity';
import { CreatePesticideDto } from './dto/create-button.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { PesticideRepository } from "./pesticide.repository";
import { Injectable } from '@nestjs/common';
import { connect, Stan } from 'node-nats-streaming';
import { firstValueFrom, timer } from 'rxjs';

@Injectable()
export class PesticideService{
    private natsClient: Stan;

    constructor(
        @InjectRepository(PesticideRepository)
        private pesticideRepository : PesticideRepository,
    ){
        this.natsClient = null;
        this.connectNats();
      }

    async connectNats() {
        const clusterId = 'cluster-name';
        const clientId = 'client-id';
        const natsUrl = 'http://localhost:8000';
      
        try {
          this.natsClient = await connect(clusterId, clientId, { url: natsUrl });
          console.log(`Connected to NATS at ${natsUrl} - pesticide`);
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
        update.schedule_btn = pesticideEntity.schedule_btn;
        update.line_1 = pesticideEntity.line_1;
        update.line_2 = pesticideEntity.line_2;
        update.line_3 = pesticideEntity.line_3;
        update.onoff = pesticideEntity.onoff;
        update.set_time = pesticideEntity.set_time;
        update.accumulated_time = pesticideEntity.accumulated_time

        await this.pesticideRepository.save(update);
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
      
            const pesticides = await this.pesticideRepository.find();
            const pesticidesToSchedule = pesticides.filter((irrigation) => irrigation.schedule_btn);
            // schedule_btn이 true면 사용자가 스케쥴을 사용하겠다고 표시해준거임.
            for (const pesticide of pesticidesToSchedule) {
              const daysOfWeek = [
                pesticide.sun_day,
                pesticide.mon_day,
                pesticide.tue_day,
                pesticide.wed_day,
                pesticide.thu_day,
                pesticide.fri_day,
                pesticide.sat_day,
              ];
              const setTime = pesticide.set_time;
              const line1 = pesticide.line_1;
              const line2 = pesticide.line_2;
              const line3 = pesticide.line_3;
              const startHour: number = Number(pesticide.s_hour);
              const startMinute: number = Number(pesticide.s_min);
              let onoff = pesticide.onoff || false;
              let accumulatedTime = pesticide.accumulated_time || 0;
      
              if (
                daysOfWeek[currentDayOfWeek] &&
                currentHour === startHour &&
                currentMinute === startMinute &&
                !onoff
              ) {
                console.log(`Starting irrigation ${pesticide.id}`);
                // TODO: 라즈베리파이 GPIO를 이용하여 라인 출력
                onoff = true;
                pesticide.onoff = onoff;
                pesticide.accumulated_time = accumulatedTime;
                await this.pesticideRepository.save(pesticide);
                console.log(`onoff is now ${onoff}`);
              }
              
              if (onoff && accumulatedTime >= setTime) {
                console.log(`Stopping pesticide ${pesticide.id}`);
                // TODO: 라즈베리파이 GPIO를 이용하여 라인 정지
                onoff = false;
                pesticide.onoff = onoff;
                await this.pesticideRepository.save(pesticide);
                console.log(`onoff is now ${onoff}`);
                accumulatedTime = 0;
              }
              
              if (onoff) {
                accumulatedTime++;
                pesticide.accumulated_time = accumulatedTime;
                await this.pesticideRepository.save(pesticide);
              }
      
              if(onoff === false){
                console.log(`Pesti ${currentHour}:${currentMinute} 현재시간`)
                console.log(`${pesticide.s_hour}:${startMinute}_${setTime} 저장시간`)
              }
            }
      
            await firstValueFrom(timer(60000))
          }
        } catch (error) {
          console.error(`startSchedule 실행중 에러: ${error}`);
        }
      }

}