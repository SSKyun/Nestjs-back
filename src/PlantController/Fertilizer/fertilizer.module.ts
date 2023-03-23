import { Fertilizer_mService } from './fertilizer_manually/fertilizer_m.service';
import { Fertilizer_mRepository } from './fertilizer_manually/fertilizer_m.repository';
import { FertilizerRepository } from './fertilizer_basic/fertilizer.repository';
import { FertilizerService } from './fertilizer_basic/fertilizer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationRepository } from '../irrigation/irrigation_basic/irrigation.repository';
import { FertilizerController } from './fertilizer.controller';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports : [
    TypeOrmModule.forFeature([FertilizerRepository,Fertilizer_mRepository]),
    ScheduleModule.forRoot(),
  ],
  controllers: [FertilizerController],
  providers: [FertilizerService,FertilizerRepository,
  Fertilizer_mService,Fertilizer_mRepository]
})
export class FertilizerModule {}
