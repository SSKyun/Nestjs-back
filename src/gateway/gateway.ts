import { Get } from "@nestjs/common";
import { OnModuleInit } from "@nestjs/common/interfaces";
import { WebSocketGateway,SubscribeMessage, MessageBody, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class MyGateway implements OnModuleInit{

    @WebSocketServer()
    server : Server;

    onModuleInit(){
        this.server.on('connection',(socket)=>{
            console.log(socket.id);
            console.log('Connected');
        })
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body:any){
        console.log(body);
        this.server.emit('onMessage',{
            msg:'New Message',
            content : body,
        })
    }
}