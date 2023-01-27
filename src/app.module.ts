import { SocketModule } from './socket/socket.module';
import { GatewayModule } from './gateway/gateway.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { BoardsModule } from './boards/boards.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [GatewayModule,BoardsModule,TypeOrmModule.forRoot(typeORMConfig), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
