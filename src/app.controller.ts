import { Controller, Get, Inject, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices/client';
import { take } from 'rxjs';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(){}
}