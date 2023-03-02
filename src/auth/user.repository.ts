import { Injectable, NotFoundException } from '@nestjs/common';
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
    constructor(private dataSource:DataSource){
        super(User,dataSource.createEntityManager());
    }

    async findName(user:{[key:string]:any}):Promise<User>{
        const userName = await User.findOneBy({id:user['sub']});
        return userName
    }

    
    async createUser(authCredentialsDto : AuthCredentialsDto){
        const { username, nickname, phone_number, id } = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        // const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = this.create({ 
            username,
            //password : hashedPassword,
            nickname,
            phone_number,
        });

        try {
            await this.save(user);
            return user.id
        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Existing username');
            }else{
                throw new InternalServerErrorException();
            }
        }
    }
    //
}