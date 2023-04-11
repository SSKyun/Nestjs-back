import { CreateMachineDto } from './dto/create-machine.dto';
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Machine_Entity } from "./machine.entity";
import { MachineRepository } from './machine.repository';

@Injectable()
export class MachineService{
    constructor(
        @InjectRepository(MachineRepository)
        private machineRepository : MachineRepository){}

    async getAllMachines():Promise<Machine_Entity[]>{
        return this.machineRepository.find({relations : ['user']});
    }

    createMachine(createMachineDto:CreateMachineDto,user:{[key:string]:any}):Promise<Machine_Entity>{
        return this.machineRepository.createMachine(createMachineDto,user);
    }

    async deleteMachine(id:number):Promise<void>{
        const result = await this.machineRepository.delete(id);
    }

    async update(id:number,machine:Machine_Entity):Promise<void>{
        const update = await this.machineRepository.findOneBy({id});
        
        await this.machineRepository.save(update);
    }
}