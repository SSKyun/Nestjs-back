import { CreateManualDto } from './dto/create-manual.dto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManualRepository } from './manual.repository';
import { Manual_Entity } from './manual.entity';
import { MqttClient, connect } from 'mqtt';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR = path.join(process.cwd(), 'log');
const LOG_FILE_NAME = 'mqtt.log';
const MAX_LOG_SIZE = 1024 * 1024 * 10;
const LOG_FILE_PATH = path.join(LOG_DIR, LOG_FILE_NAME);

@Injectable()
export class ManualService implements OnModuleInit {
  private client: MqttClient;
  private intervalId: NodeJS.Timeout;
  private logFileName: string;
  private logStream: fs.WriteStream;
  private logSize: number;

  constructor(
    @InjectRepository(ManualRepository)
    private manualRepository: ManualRepository,
  ) {}

  async onModuleInit() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR);
    }

    this.logStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' });
    const manaul = this.manualRepository.find();
    this.client = connect('mqtt://210.223.152.36:1884', {
      clientId: 'nestjs-microservice-SungKyun',
      username: 'evastick',
      password: 'evastick!@3',
      protocol: 'mqtt',
      rejectUnauthorized: false,
    });
    //수동조작 /valve_control/manual/디바이스ID
    //스케줄조작 /valve_control/schedule/디바이스ID

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
    
      if (!this.logStream) {
        const logFileName = `./log/${new Date().toISOString()}.log`;
        this.logStream = fs.createWriteStream(logFileName);
        console.log(`Created log file: ${logFileName}`);
      }
    
      const logData = `${new Date().toISOString()} - ${message.toString()}\n`;
      this.logStream.write(logData);
      this.logSize += logData.length;
    
      if (this.logSize > MAX_LOG_SIZE) {
        this.logStream.end(() => {
          const parts = this.logFileName.split('.');
          const ext = parts.pop();
          const newFileName = `${parts.join('.')}_${new Date().toISOString()}.${ext}`;
          fs.renameSync(this.logFileName, newFileName);
          this.logStream = null;
          this.logSize = 0;
          console.log(`Renamed log file: ${this.logFileName} -> ${newFileName}`);
        });
      }
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
        const manuals = await this.manualRepository.find();
        manuals.forEach(async (manual) => {
          const { rwtime1, rwtime2, rctime } = manual;
          if (rwtime1 > 0 || rwtime2 > 0 || rctime > 0) {
            console.log("매분 실행",manuals);
            const payload = {
              device: manual.device,
              rwtime1: rwtime1 - 1,
              rwtime2: rwtime2 - 1,
              rcval1: manual.rcval1,
              rcval2: manual.rcval2,
              rctime: rctime - 1,
            };
            const Mqtt_payload = `{"device": "${manual.device}","rwtime1": "${rwtime1 - 1}","rwtime2": "${rwtime2 - 1}","rcval1": "${manual.rcval1}","rcval2": "${manual.rcval2}","rctime": "${rctime - 1}"}`
            await this.client.publish(`/valve_control/manual/${manual.device}`, Mqtt_payload,{qos : 1});
            await this.manualRepository.update(manual.id, payload);
          }//log파일로 go
        });
      }
}