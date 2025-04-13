import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async get(): Promise<User[]> {
    const result: User[] = await this.prisma.user.findMany();
    return result;
  }
}
