import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from './boards.repository';
import {  MqttModule, MqttService } from 'nest-mqtt';
import { MqttClient } from 'mqtt';

@Module({
  imports : [
    TypeOrmModule.forFeature([BoardRepository]),
    MqttModule.forRoot({
      servers: [
        {
          host: '210.223.152.36',
          port: 1883,
        },
      ],
      clientId: 'nestjs-microservice-SungKyun',
      username: 'evastick',
      password: 'evastick!@3',
      protocol: 'mqtt',
      rejectUnauthorized: false,
    }),
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService,BoardRepository],
  exports:[BoardRepository]
})
export class BoardsModule {}
