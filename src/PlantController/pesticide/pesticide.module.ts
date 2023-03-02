import { PesticideRepository } from './pesticide.repository';
import { PesticideService } from './pesticide.service';
import { PesticideController } from './pesticide.controller';
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports : [
    TypeOrmModule.forFeature([PesticideRepository])
  ],
  controllers: [PesticideController],
  providers: [PesticideService,PesticideRepository]
})
export class PesticideModule {}
