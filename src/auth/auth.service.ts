import { User } from 'src/auth/user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import {ConfigService} from '@nestjs/config'
import { Request, Response } from 'express';
import argon2 from 'argon2'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,private jwtService : JwtService,
        private configService: ConfigService,

    ){}
    async refreshTokens(req : Request) {
        console.log(req.cookies)
        const verifyedUser = this.jwtService.verify(req.cookies.refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          });
      
          const user = await this.userRepository.findOneBy({ id: verifyedUser.sub });
          return {
            accessToken: await this.jwtService.signAsync(
              {
                sub: user.id,
                username: user.nickname,
              },
              {
                secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                expiresIn: '15m',
              },
            ),
          };
      }

      async parseJWT(jwt : string){
        return this.jwtService.decode(jwt)
      }

      async getAllUsers(user:{[key:string]:any}):Promise<User>{
        return this.userRepository.findName(user);
      }

      async getTokens(userId: number, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
            },
            {
              secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
              expiresIn: '15m',
            },
          ),
          this.jwtService.signAsync(
            {
              sub: userId,
              username,
            },
            {
              secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
              expiresIn: '7d',
            },
          ),
        ]);
    
        return {
          accessToken,
          refreshToken,
        };
      }

      async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userRepository.update(userId, {
          refreshToken: hashedRefreshToken,
        });
      }

      hashData(data: string) {
        return argon2.hash(data);
      }


    async signUp(authCredentialsDto : AuthCredentialsDto){
        return this.userRepository.createUser(authCredentialsDto);
    }


    async signIn(authCredentialsDto:AuthCredentialsDto,res : Response) {
        const { username } = authCredentialsDto;
        const user = await this.userRepository.findOneBy({ username });
        if(user /*&& (await bcrypt.compare(password, user.password))*/){
            // 유저 토큰 생성 ( Secret + Payload )
            const {accessToken, refreshToken} = await this.getTokens(user.id,username)
            res.cookie('refreshToken',refreshToken,{
                maxAge : 60*60*24*7,
                httpOnly : true
            })
            // refreshToken -> client http only cookie 
            return {accessToken,username}
        }else{
            throw new UnauthorizedException('login failed')
        }
    }

    async deleteUser(id : number):Promise<void>{
      await this.userRepository.delete(id);
    }

    async updateUser(id:number,user:User):Promise<void>{
      const update = await this.userRepository.findOneBy({id});
      update.nickname = user.nickname;
      update.phone_number = user.phone_number;

      await this.userRepository.save(update);
    }

    
}
