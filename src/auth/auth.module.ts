import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as config from 'config';
import { RefreshTokenStrategy } from './token/refreshToken.strategy';
import { AccessTokenStrategy } from './token/accessToken,strategy';
import { ConfigModule } from '@nestjs/config';

const jwtConfig = config.get('jwt');

@Module({
  imports : [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions:{
        expiresIn: 3600,
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [AuthService,UserRepository,AccessTokenStrategy,RefreshTokenStrategy],
  exports: [PassportModule]
})
export class AuthModule {}
