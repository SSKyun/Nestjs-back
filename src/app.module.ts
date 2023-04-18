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
import { ManualModule } from './PlantController/Manual_controler/manual.module';
import { EnvirModule } from './statistics/envir_stat.module';


@Module({
  imports: [GatewayModule,BoardsModule,
    TypeOrmModule.forRoot(typeORMConfig), 
    AuthModule, 
    IrrigationModule,
    CommentsModule,
    DeviceModule,
    MachineModule,
    ManualModule,
    EnvirModule,
    MqttModule.forRoot({
      servers: [
        {
          host: process.env.MQTT_HOST,
          port: parseInt(process.env.MQTT_PORT_M),
        },
      ],
      clientId: process.env.MQTT_CLIENT_ID,
      username: process.env.MQTT_USER_NAME,
      password: process.env.MQTT_PASSWORD,
      protocol: 'mqtt',
      rejectUnauthorized: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports : [MqttModule]
})
export class AppModule {}
