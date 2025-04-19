import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { SafeUserDto } from './dto/safe-result.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: LoginAuthDto): Promise<{ access_token: string }> {
    const userDb: User | null = await this.prisma.user.findFirst({
      where: {
        username: signInDto.username,
      },
    });

    if (!userDb) {
      throw new BadRequestException('Username or Password is incorrect');
    }

    const validatePassword: boolean = await this.verifyingPassword(
      signInDto.password,
      userDb.passwordHash,
    );

    if (!validatePassword) {
      throw new BadRequestException('Username or Password is incorrect');
    }
    const payload = {
      sub: userDb.id,
      username: userDb.username,
    };
    const accessToken: string = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }

  async verifyingPassword(
    inputPassword: string,
    passwordHashed: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, passwordHashed);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async signUp(registerAuthDto: RegisterAuthDto): Promise<SafeUserDto> {
    const user: User | null = await this.prisma.user.findFirst({
      where: {
        username: registerAuthDto.username,
      },
    });
    if (user) {
      throw new UnauthorizedException('Username already exists');
    }

    const hashedPassword: string = await this.hashPassword(
      registerAuthDto.password,
    );

    const createdUser: User = await this.prisma.user.create({
      data: {
        username: registerAuthDto.username,
        passwordHash: hashedPassword,
      },
    });
    return new SafeUserDto(createdUser.id, createdUser.username);
  }
}
