import { IrrigationRepository } from './irrigation.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrrigationController } from './irrigation.controller';
import { IrrigationService } from './irrigation.service';

@Module({
  imports : [
    TypeOrmModule.forFeature([IrrigationRepository])
  ],
  controllers: [IrrigationController],
  providers: [IrrigationService,IrrigationRepository]
})
export class IrrigationModule {}
