import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './boards.repository';

@Module({
  imports : [
    TypeOrmModule.forFeature([BoardRepository]),
    AuthModule
  ],
  controllers: [BoardsController],
  providers: [BoardsService,BoardRepository],
  exports:[BoardRepository]
})
export class BoardsModule {}
