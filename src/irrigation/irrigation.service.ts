import { IrrigationRepository } from './irrigation.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateButtonDto } from './dto/create-button.dto';
import { Irrigation } from './irrigation.entity';

@Injectable()
export class IrrigationService {
    constructor(
        @InjectRepository(IrrigationRepository)
        private irrigationRepository : IrrigationRepository,
    ){}

    createButton(createButtonDto : CreateButtonDto) : Promise<Irrigation>{
        return this.irrigationRepository.createButton(createButtonDto);
    }
}
