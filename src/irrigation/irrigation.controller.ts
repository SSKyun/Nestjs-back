import { Irrigation } from './irrigation.entity';
import { CreateButtonDto } from './dto/create-button.dto';
import { IrrigationService } from './irrigation.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('irrigation')
export class IrrigationController {
    constructor(private irrigationService: IrrigationService) { }

    @Post()
    createButton(@Body() createbuttonDto: CreateButtonDto): Promise<Irrigation>{
        return this.irrigationService.createButton(createbuttonDto);
    }

}
