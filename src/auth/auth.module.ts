import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtConfigService } from './configs/jwt-service.config';
import { BcryptService } from './utils/bcrypt.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    BcryptService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [BcryptService],
})
export class AuthModule {}
