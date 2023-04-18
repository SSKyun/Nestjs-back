import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClient, connect } from 'mqtt';

@Injectable()
export class AppService implements OnModuleInit {
  private client: MqttClient;

  constructor() {}

  async onModuleInit() {
  }
}


