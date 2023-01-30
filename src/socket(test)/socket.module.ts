import { SocketClient } from './socket-client';
import { Module } from "@nestjs/common";


@Module({
    providers:[SocketClient],
})
export class SocketModule{}