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

  async startSchedule() {
    const irrigations = await this.irrigationRepository.find();
    irrigations.forEach((irrigation) => {
      const daysOfWeek = {
        0: irrigation.sun_day,
        1: irrigation.mon_day,
        2: irrigation.tue_day,
        3: irrigation.wed_day,
        4: irrigation.thu_day,
        5: irrigation.fri_day,
        6: irrigation.sat_day,
      };
      let onoff = irrigation.onoff;
      const onTime = irrigation.on_time;
      const setTime = irrigation.set_time;
      const line1 = irrigation.line_1;
      const line2 = irrigation.line_2;
      const line3 = irrigation.line_3;
      const startHour = irrigation.s_hour;
      const startMinute = irrigation.s_min;

      const job = async () => {
        let now = new Date();
        const currentDay = now.getDay();
        if (daysOfWeek[currentDay]) {
          const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0, 0);
          const end = new Date(start.getTime() + onTime * 60 * 1000);
          const duration = setTime * 60 * 1000;

          while (now < end) {
            const message = {
              line1,
              line2,
              line3,
              onoff,
            };
            this.natsClient.publish('irrigation', JSON.stringify(message));
            await new Promise((resolve) => setTimeout(resolve, duration));
            onoff = !onoff;
            now = new Date();
          }
        }
      };

      const subscription = this.natsClient.subscribe('start_irrigation', { queue: 'irrigation_queue' }, () => {
        const timeoutId = setTimeout(() => {
          subscription.unsubscribe();
        }, 10000);

        job().finally(() => clearTimeout(timeoutId));
      });
    });
  }
}