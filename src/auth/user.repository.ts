import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Repository, EntityRepository, DataSource } from 'typeorm';
import { User } from './user.entity';
import { ConflictException, InternalServerErrorException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserRepository extends Repository<User>{
    constructor(private dataSource:DataSource){
        super(User,dataSource.createEntityManager());
    }
    async createUser(authCredentialsDto : AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = this.create({ 
            username,
            password : hashedPassword,
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