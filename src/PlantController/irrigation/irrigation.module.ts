import { Irrigation_mService } from './irrigation_m.service';
import { Irrigation_mRepository } from './irrigation_m.repository';
import { IrrigationRepository } from './irrigation.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports : [
    TypeOrmModule.forFeature([IrrigationRepository,Irrigation_mRepository]),
    ScheduleModule.forRoot(),
  ],
  controllers: [IrrigationController],
  providers: [IrrigationService,IrrigationRepository,
  Irrigation_mService,Irrigation_mRepository,
  ]
})
export class IrrigationModule {}
