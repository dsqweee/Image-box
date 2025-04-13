import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<{ access_token: string }> {
    const auth = await this.prisma.user.findFirst({
      where: {
        username: loginAuthDto.username,
        passwordHash: loginAuthDto.password,
      },
    });

    if (!auth) {
      throw new UnauthorizedException('Login or password is wrong!');
    }

    const payload = {
      sub: auth.Id,
      username: auth.username,
    };
    const access_token: string = await this.jwtService.signAsync(payload);

    return {
      access_token: access_token,
    };
  }

  async register(registerAuthDto: RegisterAuthDto): Promise<string> {
    const auth: User | null = await this.prisma.user.findFirst({
      where: {
        username: registerAuthDto.username,
        passwordHash: registerAuthDto.password,
      },
    });

    if (auth) {
      throw new ConflictException('Username is already exists!');
    }

    await this.prisma.user.create({
      data: {
        username: registerAuthDto.username,
        passwordHash: registerAuthDto.password,
      },
    });

    return 'Successfully registered';
  }
}
