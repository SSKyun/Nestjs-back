import { OnModuleInit } from '@nestjs/common/interfaces';
import { Injectable } from '@nestjs/common';
import { io,Socket} from 'socket.io-client';

@Injectable()
export class SocketClient{

    public socketClient : Socket;

    constructor(){
        this.socketClient = io('http://localhost:8001');
    }

    OnModuleInit(){
        this.registerConsumerEvents();
    }

    private registerConsumerEvents(){
        this.socketClient.emit('newMessage',{ msg : 'hey there!' });
        this.socketClient.on('connect',()=>{
            console.log('Connected to GateWay');
        });
        this.socketClient.on('Message',(payload : any) => {
            console.log(payload);
        })
    }

}