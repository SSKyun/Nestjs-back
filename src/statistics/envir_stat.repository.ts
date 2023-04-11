import { CreateEnvirDto } from './dto/create-envir.dto';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Envir_Entity } from './envir_stat.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EnvirRepository extends Repository<Envir_Entity>{
    constructor(private dataSource:DataSource){
        super(Envir_Entity,dataSource.createEntityManager());
    }
    async createEnvir(createEnvirDto:CreateEnvirDto,user:{[key:string]:any}):Promise<Envir_Entity>{
        const user0 = await User.findOneBy({id:user['sub']});
        const {temperature,humidity,soil_humid,grow} = createEnvirDto;
        const envir = this.create({
            temperature,
            humidity,
            soil_humid,
            grow,
            user:user0
        })
        await this.save(envir);
        return envir;
    }

}