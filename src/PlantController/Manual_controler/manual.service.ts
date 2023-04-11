import { CreateManualDto } from './dto/create-manual.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManualRepository } from './manual.repository';
import { Manual_Entity } from './manual.entity';
@Injectable()
export class ManualService{
    constructor(
        @InjectRepository(ManualRepository)
        private manualRepository : ManualRepository
    ){}

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
        update.machine_id = manual.machine_id;
        update.etime = manual.etime;
        update.wtime1 = manual.wtime1;
        update.wtime2 = manual.wtime2;
        update.ctime1 = manual.ctime1;
        update.ctime2 = manual.ctime2;
        update.accumulated_time = manual.accumulated_time;
        update.r_time = manual.r_time;

        await this.manualRepository.save(update);
    }
}