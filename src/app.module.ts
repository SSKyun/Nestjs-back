import { FertilizerModule } from './PlantController/Fertilizer/fertilizer.module';
// import { SocketModule } from './socket(test)/socket.module';
import { GatewayModule } from './gateway/gateway.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { IrrigationModule } from './PlantController/irrigation/irrigation.module';
import { PesticideModule } from './PlantController/pesticide/pesticide.module';
import { CommentsModule } from './comments/comments.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { MqttModule } from 'nest-mqtt';


@Module({
  imports: [GatewayModule,BoardsModule,
    TypeOrmModule.forRoot(typeORMConfig), 
    AuthModule, 
    IrrigationModule,
    PesticideModule,
    FertilizerModule,
    CommentsModule,
    // MqttModule.forRoot({
    //   servers: [
    //     {
    //       host: '210.223.152.36',
    //       port: 22,
    //     },
    //   ],
    //   clientId: 'nestjs-microservice-SungKyun',
    //   username: 'root',
    //   password: 'amol@dkagh',
    //   protocol: 'mqtt',
    //   rejectUnauthorized: false,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
