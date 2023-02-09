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
import { IrrigationModule } from './irrigation/irrigation.module';


@Module({
  imports: [GatewayModule,BoardsModule,TypeOrmModule.forRoot(typeORMConfig), AuthModule, IrrigationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
