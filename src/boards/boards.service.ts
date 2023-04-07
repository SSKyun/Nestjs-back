import { OnModuleInit } from '@nestjs/common/interfaces';
import { AppService } from './../app.service';
import { User } from 'src/auth/user.entity';
import { BoardRepository } from './boards.repository';
import { CreateBoardDto } from './dto/create-board.dto';
import { Get, Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { MqttClient } from 'mqtt';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository : BoardRepository,
        private readonly mqttClient : MqttClient,
    ){}//boardservice안에서 repository 사용가능하게함.

    async sendMessage(topic : string,message : string){
        await this.mqttClient.emit(topic,message)
    }

    async subscribeToTopic(topic : string){
        await this.mqttClient.subscribe(topic);
    }

    async handleReceivedMessage(topic:string,message:Buffer){
        console.log(`Received message on topic ${topic}: ${message.toString}`);
    }

    async findOne(id:number): Promise<Board>{
        return this.boardRepository.findOneBy({id});
    }


    async getAllBoards(
        //user:User
    ): Promise<Board[]> {
        const query = this.boardRepository.createQueryBuilder('board');

        //query.where('board.userId = :userId',{ userId : user.id });

        // const boards = await query.getMany(); 자신의 게시물만 가져오기
        
        // // return boards;
        return this.boardRepository.find({relations:['user']});
    }

    createBoard(createBoardDto : CreateBoardDto, user:{[key : string] : any}): Promise<Board> {
        console.log(user)
        return this.boardRepository.createBoard(createBoardDto, user);
    }

    // async deleteBoard(id : number, user:{[key:string]:any}) : Promise<void>  {
    //     const result = await this.boardRepository.delete({id,user}); //delete 직접 들어가서 user인수 추가
    //     if(result.affected == 0){
    //         throw new NotFoundException(`Can't find Board with id ${id} && ${user}`);
    //     }
    //     console.log('result',result);
    // } 해당 유저만 삭제가능하게.

    async deleteBoard2(id:number):Promise<void>{
        const result = await this.boardRepository.delete(id);
    }

    async getBoardById(id: any): Promise<Board> {
        const found = await this.boardRepository.findOne({ 
          where: { id }, 
          relations: ['user'] 
        });
      
        if(!found){
          throw new NotFoundException(`Can't find Board with id ${id}`);
        }
      
        return found;
    }
    async update(id:number,board:Board):Promise<void>{
        const update = await this.boardRepository.findOneBy({id});
        update.title = board.title;
        update.description = board.description;
        update.status = board.status;

        await this.boardRepository.save(update);
    }

    

}