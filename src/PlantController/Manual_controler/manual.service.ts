import { CreateManualDto } from './dto/create-manual.dto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManualRepository } from './manual.repository';
import { Manual_Entity } from './manual.entity';
import { MqttClient, connect } from 'mqtt';
@Injectable()
export class ManualService implements OnModuleInit{
    private client : MqttClient;
    private intervalId: NodeJS.Timeout;
    constructor(
        @InjectRepository(ManualRepository)
        private manualRepository : ManualRepository
    ){}

    async onModuleInit() {
        this.client = connect('mqtt://210.223.152.36:1884', {
        clientId: 'nestjs-microservice-SungKyun',
        username: 'evastick',
        password: 'evastick!@3',
        protocol: 'mqtt',
        rejectUnauthorized: false,
        });

        this.client.on('connect', () => {
        this.client.subscribe('test', (err) => {
            if (err) {
            console.log(`error subscribing to test`, err);
            } else {
            console.log(`successfully subscribed to test`);
            }
        });
        });

        this.client.on('message', (topic, message) => {
        console.log(`Received a message on topic "${topic}": ${message.toString()}`);
        });
        this.intervalId = setInterval(() => {
            this.checkAndSendMessage();
        }, 60 * 1000);
    }

    async getAllManuals():Promise<Manual_Entity[]>{
        return this.manualRepository.find({relations:['user']});
    }

    createManual(createManualDto : CreateManualDto,user:{[key:string]:any}):Promise<Manual_Entity>{
        return this.manualRepository.createManual(createManualDto,user);
    }

    async deleteManual(id:number):Promise<void>{
        const result = await this.manualRepository.delete(id);
    }

    async update(id:number,manual:Manual_Entity):Promise<void>{
        const update = await this.manualRepository.findOneBy({id});
        update.device = manual.device;
        update.rwtime1 = manual.rwtime1;
        update.rwtime2 = manual.rwtime2;
        update.rcval1 = manual.rcval1;
        update.rcval2 = manual.rcval2;
        update.accumulated_time = manual.accumulated_time;
        update.r_time = manual.r_time;

        await this.manualRepository.save(update);
    }

    async checkAndSendMessage() {
        console.log("매분 실행");
        const manuals = await this.manualRepository.find();
        manuals.forEach(async (manual) => {
          const { rwtime1, rwtime2, rctime } = manual;
          if (rwtime1 >= 0 || rwtime2 >= 0 || rctime >= 0) {
            const payload = {
              device: manual.device,
              rwtime1: rwtime1 - 1,
              rwtime2: rwtime2 - 1,
              rcval1: manual.rcval1,
              rcval2: manual.rcval2,
              rctime: rctime - 1,
            };
            const Mqtt_payload = `{
              "device": "${manual.device}",
              "rwtime1": "${rwtime1 - 1}",
              "rwtime2": "${rwtime2 - 1}",
              "rcval1": "${manual.rcval1}",
              "rcval2": "${manual.rcval2}",
              "rctime": "${rctime - 1}",
            }`
            await this.client.publish('/test', JSON.stringify(payload));
            await this.manualRepository.update(manual.id, payload);
          }
        });
      }
}