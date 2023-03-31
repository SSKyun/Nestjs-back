import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices/enums';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as mqtt from 'mqtt';

const mqttOptions = {
  url: '210.223.152.36:22',
  options: {
    clientId: 'nestjs-microservice',
    username: 'root',
    password: 'amol@dkagh',
    rejectUnauthorized: false,
  },
};

const mqttClient = mqtt.connect(mqttOptions.url, mqttOptions.options);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;
  app.use(cookieParser());
  app.enableCors({
  origin : ["http://localhost:3000"],
  credentials: true
  })
  await app.listen(port);
  Logger.log(`Application running on port ${port}`)
}
bootstrap(); 