import { Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { Repository, EntityRepository, DataSource } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User>{
    constructor(private dataSource:DataSource){
        super(User,dataSource.createEntityManager());
    }
    async createUser(authCredentialsDto : AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = this.create({ 
            username,
            password,
        });
        await this.save(user);
    }
}