import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  create(@Body() User: User): Promise<User> {
    return this.appService.create(User);
  }

  @Get()
  get(): Promise<User[]> {
    return this.appService.get();
  }
}
