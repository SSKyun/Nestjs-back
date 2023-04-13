import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';

@Injectable()
export class AppService implements OnModuleInit {
  private client: MqttClient;

  constructor() {}

  async onModuleInit() {
    // this.client = connect('mqtt://210.223.152.36:1884', {
    //   clientId: 'nestjs-microservice-SungKyun',
    //   username: 'evastick',
    //   password: 'evastick!@3',
    //   protocol: 'mqtt',
    //   rejectUnauthorized: false,
    // });

    // this.client.on('connect', () => {
    //   this.client.subscribe('test', (err) => {
    //     if (err) {
    //       console.log('error subscribing to test', err);
    //     } else {
    //       console.log('successfully subscribed to test');
    //     }
    //   });
    // });

    // this.client.on('message', (topic, message) => {
    //   console.log(`Received a message on topic "${topic}": ${message.toString()}`);
    // });
    // // /test 로 JSON 형태로 보내야 댐.
    // this.client.publish('/test',`{"message" : "laalala"}`);
  }
}


