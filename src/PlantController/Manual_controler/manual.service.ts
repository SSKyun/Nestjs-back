import { CreateManualDto } from './dto/create-manual.dto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManualRepository } from './manual.repository';
import { Manual_Entity } from './manual.entity';
import { MqttClient, connect } from 'mqtt';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
const LOG_DIR = path.join(process.cwd(), 'log');
const LOG_FILE_NAME = 'mqtt.log';
const MAX_LOG_SIZE = 1024 * 1024 * 10;
const LOG_FILE_PATH = path.join(LOG_DIR, LOG_FILE_NAME);


@Injectable()
export class ManualService implements OnModuleInit {
  client: MqttClient;
  private intervalId: NodeJS.Timeout;
  private logFileName: string;
  private logStream: fs.WriteStream;
  private logSize: number;
  private logPath = 'log/mqtt.log';
  constructor(
    @InjectRepository(ManualRepository)
    private manualRepository: ManualRepository,
  ) {}

  public getMqttClient(): MqttClient{
    return this.client;
  }

  async onModuleInit() {
    console.log(this.client);
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR);
    }
    this.logStream = fs.createWriteStream(LOG_FILE_PATH, { flags: 'a' });
    this.client = connect(`mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`, { // 스케줄 관리에서도 이렇게 똑같이 사용하면 됨.
      clientId: process.env.MQTT_CLIENT_ID,
      username: process.env.MQTT_USER_NAME,
      password: process.env.MQTT_PASSWORD,
      protocol: 'mqtt',
      rejectUnauthorized: false,
    });
    this.client.on('connect', () => {
      this.client.subscribe('MQTT SERVER', (err) => {
        if (err) {
          console.log(`error subscribing to MQTT SERVER`, err);
        } else {
          console.log(`successfully subscribed to MQTT SERVER`);
        }
      });
      this.client.subscribe(`/valve_control/start/+`,(err)=>{
        if (err) {
          console.log(`error subscribing to START`, err);
        } else {
          console.log(`successfully subscribed to START`);
        }
      })
      this.client.subscribe(`/valve_control/log/+`,(err)=>{
        if (err) {
          console.log(`error subscribing to LOG`, err);
        } else {
          console.log(`successfully subscribed to LOG`);
        }
      })
      this.client.subscribe(`/valve_control/end/+`,(err)=>{
        if (err) {
          console.log(`error subscribing to END`, err);
        } else {
          console.log(`successfully subscribed to END`);
        }
      })
      this.client.subscribe(`/valve_control/error/+`,(err)=>{
        if (err) {
          console.log(`error subscribing to ERROR`, err);
        } else {
          console.log(`successfully subscribed to ERROR`);
        }
      })

    });
    

    this.client.on('message', async (topic, message) => {
      console.log(`Received a message on topic "${topic}": ${message.toString()}`);
      try {
        if (topic.startsWith('/valve_control/log/')) {
          const data = JSON.parse(message.toString());
          const payload = JSON.stringify({
            device: data.device,
            rwtime1: data.rwtime1,
            rwtime2: data.rwtime2,
            rcval1: data.rcval1,
            rcval2: data.rcval2,
            rctime: data.rctime
          });
          this.client.publish(`/valve_control/check/${data.device}`, payload, { qos: 1 });
        }
        if(topic.startsWith('/valve_control/end/')){
          const data = JSON.parse(message.toString());
          const device = data.device;
          const manual = await this.manualRepository
            .createQueryBuilder('manual')
            .where('manual.device = :device', { device })
            .getOne();
          if (manual) {
            console.log(manual)
            manual.rwtime1 = 0;
            manual.rwtime2 = 0;
            manual.rcval1 = 0;
            manual.rcval2 = 0;
            manual.rctime = 0;
            
            console.log(manual)
            await this.manualRepository.save(manual);
          } else {
            console.log(`Manual not found for device ${device}`);
          }
        }
        
      } catch (err) {
        console.log(`Error parsing message data : ${err}`);
      }

      if (!this.logStream) {
        const logFileName = `./log/${new Date().toISOString()}.log`;
        this.logStream = fs.createWriteStream(logFileName);
        console.log(`Created log file: ${logFileName}`);
      }
      if (topic.startsWith('/valve_control/start/') || topic.startsWith('/valve_control/end/')) {
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
      }
    });

  }

    async getAllManuals(
      user: {[key:string]:any}
    ):Promise<Manual_Entity[]>{
      const query = this.manualRepository.createQueryBuilder('manual');
      query.where('manual.userId = :userId',{userId:user['sub']});
      const manuals = await query.getMany();
      return manuals;
    }

    async showLogManual(device?: string): Promise<string> {
      const data = await fs.promises.readFile(this.logPath,'utf-8');
      const logs = device ? data.split('\n').filter(log => log.includes(device)) : data.split('\n');
      return logs.join('\n');
    }

    createManual(createManualDto : CreateManualDto,user:{[key:string]:any}):Promise<Manual_Entity>{
        return this.manualRepository.createManual(createManualDto,user);
    }

    async deleteManual(id:number):Promise<void>{
        const result = await this.manualRepository.delete(id);
    }

    async update(id:number,manual:Manual_Entity):Promise<number>{
        const update = await this.manualRepository.findOneBy({id});
        update.device = manual.device;
        update.rwtime1 = manual.rwtime1;
        update.rwtime2 = manual.rwtime2;
        update.rcval1 = manual.rcval1;
        update.rcval2 = manual.rcval2;
        update.rctime = manual.rctime;

        await this.manualRepository.save(update);
        const Mqtt_payload = `{"device": "${manual.device}","rwtime1": "${manual.rwtime1}","rwtime2": "${manual.rwtime2}","rcval1": "${manual.rcval1}","rcval2": "${manual.rcval2}","rctime": "${manual.rctime}","accumulated_time": "${manual.accumulated_time}"}`
        await this.client.publish(`/valve_control/manual/${manual.device}`, Mqtt_payload,{qos : 1});
        return 200;
    }
    

}