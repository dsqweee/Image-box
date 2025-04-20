import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
