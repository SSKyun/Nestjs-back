import { Irrigation } from './irrigation.entity';
import { Repository, DataSource } from 'typeorm';
import { Injectable } from "@nestjs/common";
import { CreateButtonDto } from './dto/create-button.dto';

@Injectable()
export class IrrigationRepository extends Repository<Irrigation>{
    constructor(private dataSource : DataSource){
        super(Irrigation, dataSource.createEntityManager());
    }
    async createButton(createbuttonDto:CreateButtonDto): Promise<Irrigation>{
        const {user,time,linename,onoff} = createbuttonDto;

        const button = this.create({
            user,
            time,
            linename,
            onoff : false
        })
        await this.save(button);
        return button;
    }
}