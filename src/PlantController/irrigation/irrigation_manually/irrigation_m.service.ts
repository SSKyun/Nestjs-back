import { Irrigation_mRepository } from './irrigation_m.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { connect, Stan } from 'node-nats-streaming';
import { Create_mButtonDto } from '../dto/create-mbutton.dto';
import { Irrigation_m } from './irrigation_m.entity';

@Injectable()
export class Irrigation_mService{
    private natsClient : Stan;

    constructor(
        @InjectRepository(Irrigation_mRepository)
        private irrigation_mRepository: Irrigation_mRepository,
      ) {
        this.natsClient = null;
        //this.connectNats();
      }
    
      // async connectNats() {
      //   const clusterId = 'cluster-name';
      //   const clientId = 'client-id';
      //   const natsUrl = 'http://localhost:8000';
      
      //   try {
      //     this.natsClient = await connect(clusterId, clientId, { url: natsUrl });
      //     console.log(`Connected to NATS at ${natsUrl} - irrigation_m`);
      //     this.natsClient.on('close', () => {
      //       console.log(`Disconnected from NATS at ${natsUrl}`);
      //       process.exit(1);
      //     });
      //   } catch (err) {
      //     console.error(`NATS error: ${err}`);
      //     process.exit(1);
      //   }
      // }

    async getuserAll_m(
        user:{[key:string]:any}
    ):Promise<Irrigation_m[]>{
        const query = this.irrigation_mRepository.createQueryBuilder('irrigation_m');
        query.where('irrigation_m.userId = :userId',{userId : user['sub']});
        const buttons = await query.getMany();
        return buttons;
    }

    createIrrigation_m(
        create_mButtonDto:Create_mButtonDto,
        user: {[key:string]:any},
      ):Promise<Irrigation_m>{
        return this.irrigation_mRepository.createIrrigation_m(create_mButtonDto,user);
    }

    async update_manually(id: number, irrigation_m:Irrigation_m ): Promise<void> {
        const update = await this.irrigation_mRepository.findOneBy({ id });
        update.manually_time = irrigation_m.manually_time;
        update.manually_btn = irrigation_m.manually_btn;
      
        await this.irrigation_mRepository.save(update);
      
        const interval = setInterval(async () => {
          try {
            console.log("interval_m 작동");
            if (update.manually_time > 0 && update.manually_btn === true) {
              await this.natsClient.publish('irrigation.button.update', JSON.stringify({id, accumulated_time: (update.accumulated_time ?? 0) + 1}));
              update.accumulated_time = (update.accumulated_time ?? 0) + 1;
              update.manually_time--;
              await this.irrigation_mRepository.save(update);
            } else {
              update.manually_time = 0;
              update.manually_btn = false;
              await this.irrigation_mRepository.save(update);
              await this.natsClient.publish('irrigation.button.update', JSON.stringify({id, manually_btn: false}));
              clearInterval(interval);
            }
          } catch (error) {
            console.error(`update_manually 실행 중 에러: ${error}`);
          }
        }, 60000);
      }
}