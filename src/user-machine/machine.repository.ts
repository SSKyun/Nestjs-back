import { CreateMachineDto } from './dto/create-machine.dto';
import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Machine_Entity } from './machine.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class MachineRepository extends Repository<Machine_Entity>{
    constructor(private dataSource:DataSource){
        super(Machine_Entity,dataSource.createEntityManager());
    }
    async createMachine(createMachineDto:CreateMachineDto,user:{[key:string]:any}):Promise<Machine_Entity>{
        const user0 = await User.findOneBy({id:user['sub']});
        const {device,m_address} = createMachineDto;
        const machine = this.create({
            device,
            m_address,
            user : user0
        });

        await this.save(machine);
        return machine;
    }
}