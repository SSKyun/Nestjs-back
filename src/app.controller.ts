import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices/client';
import { take } from 'rxjs';
import { AppService } from './app.service';
import { MqttService, Payload } from 'nest-mqtt';

@Controller()
export class AppController{}