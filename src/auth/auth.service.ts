import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { IUserToken } from './interfaces/user-token.interface';
import { SafeUserDto } from './dto/safe-result.dto';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async localValidateUser(userData: LoginAuthDto): Promise<SafeUserDto | null> {
    const userDb: User | null = await this.prisma.user.findFirst({
      where: {
        username: userData.username,
      },
    });

    if (!userDb) {
      throw new BadRequestException('Username or Password is incorrect');
    }

    const validatePassword: boolean = await this.verifyingPassword(
      userData.password,
      userDb.passwordHash,
    );

    if (!validatePassword) {
      throw new BadRequestException('Username or Password is incorrect');
    }

    return new SafeUserDto(userDb.id, userDb.username);
  }

  async login(user: SafeUserDto): Promise<IUserToken> {
    const accessToken: string = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });

    return {
      id: user.id,
      username: user.username,
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

  async register(registerAuthDto: RegisterAuthDto): Promise<SafeUserDto> {
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
