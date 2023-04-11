import { CreateEnvirDto } from './dto/create-envir.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EnvirRepository } from './envir_stat.repository';
import { Envir_Entity } from './envir_stat.entity';

@Injectable()
export class EnvirService{
    constructor(@InjectRepository(EnvirRepository)
    private envirRepository : EnvirRepository
    ){}

    async getAllEnvir(user:{[key:string]:any}):Promise<Envir_Entity[]>{
        const query = this.envirRepository.createQueryBuilder('envir_stat');
        query.where('envir_stat.userId=:userId',{userId : user['sub']});
        const envirs = await query.getMany();
        return envirs;
    }

    createEnvir(createEnvirDto:CreateEnvirDto,
        user:{[key:string]:any},
    ):Promise<Envir_Entity>{
        return this.envirRepository.createEnvir(createEnvirDto,user);
    }

    async deleteEnvir(id:number):Promise<void>{
        const result = await this.envirRepository.delete(id);
    }

    async update(id:number,envir_Entity:Envir_Entity):Promise<void>{
        const update = await this.envirRepository.findOneBy({id});
        update.temperature = envir_Entity.temperature;
        update.humidity = envir_Entity.humidity;
        update.soil_humid = envir_Entity.soil_humid;
        update.grow = envir_Entity.grow;

        await this.envirRepository.save(update);
    }
}