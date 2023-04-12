// import { SocketModule } from './socket(test)/socket.module';
import { GatewayModule } from './gateway/gateway.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { IrrigationModule } from './PlantController/irrigation/irrigation.module';
import { CommentsModule } from './comments/comments.module';
import { MqttModule } from 'nest-mqtt';
import { DeviceModule } from './PlantController/Device/device.module';
import { MachineModule } from './user-machine/machine.module';


@Module({
  imports: [GatewayModule,BoardsModule,
    TypeOrmModule.forRoot(typeORMConfig), 
    AuthModule, 
    IrrigationModule,
    CommentsModule,
    DeviceModule,
    MachineModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
  exports : [MqttModule]
})
export class AppModule {}
