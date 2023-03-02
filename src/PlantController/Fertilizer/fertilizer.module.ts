import { FertilizerRepository } from './fertilizer.repository';
import { FertilizerService } from './fertilizer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationRepository } from '../irrigation/irrigation.repository';
import { FertilizerController } from './fertilizer.controller';


@Module({
  imports : [
    TypeOrmModule.forFeature([FertilizerRepository])
  ],
  controllers: [FertilizerController],
  providers: [FertilizerService,FertilizerRepository]
})
export class FertilizerModule {}
