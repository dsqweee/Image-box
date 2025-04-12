import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async create(data: User): Promise<User> {
    const result: User = await this.prisma.user.create({
      data: {
        username: data.username,
        PasswordHash: data.PasswordHash,
      },
    });

    return result;
  }

  async get(): Promise<User[]> {
    const result: User[] = await this.prisma.user.findMany();
    return result;
  }
}
