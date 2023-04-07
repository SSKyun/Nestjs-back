import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class AppService {}
// implements OnModuleInit {
//     private client: mqtt.Client;
  
//     constructor() {}
  
//     onModuleInit() {
//       const options: mqtt.IClientOptions = {
//         host: '210.223.152.36',
//         port: 1883,
//         username: 'evastick',
//         password: 'evastick!@3',
//       };
  
//       this.client = mqtt.connect(options);
  
//       this.client.on('connect', () => {
//         console.log('Connected to MQTT broker');
//       });
  
//       this.client.on('error', (err) => {
//         console.error('MQTT Connection error:', err);
//       });
//     }

// }
