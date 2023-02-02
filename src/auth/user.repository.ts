import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Repository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, ForbiddenException, InternalServerErrorException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';
import  argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserRepository extends Repository<User>{
    constructor(private dataSource:DataSource     ){
        super(User,dataSource.createEntityManager());
    }

    
    async createUser(authCredentialsDto : AuthCredentialsDto) : Promise<void> {
        const { username, password, nickname } = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = this.create({ 
            username,
            password : hashedPassword,
            nickname,
        });

        try {
            await this.save(user);
            console.log("회원가입 성공!")
        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Existing username');
            }else{
                throw new InternalServerErrorException();
            }
        }
    }
}