import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { IUserToken } from './interfaces/user-token.interface';
import { SafeUserDto } from './dto/safe-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<SafeUserDto | null> {
    const userExist: User | null = await this.prisma.user.findFirst({
      where: {
        username: username,
        passwordHash: password,
      },
    });

    if (userExist) {
      return new SafeUserDto(userExist.id, userExist.username);
      /*const { passwordHash, ...userWithoutPassword } = userExist;
      return userWithoutPassword;*/
    }
    return null;
  }

  async login(user: User): Promise<IUserToken> {
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

  async register(registerAuthDto: RegisterAuthDto): Promise<SafeUserDto> {
    const user: User | null = await this.prisma.user.findFirst({
      where: {
        username: registerAuthDto.username,
      },
    });
    if (user) {
      throw new UnauthorizedException('username already exists');
    }
    const createdUser: User = await this.prisma.user.create({
      data: {
        username: registerAuthDto.username,
        passwordHash: registerAuthDto.password,
      },
    });
    return new SafeUserDto(createdUser.id, createdUser.username);
    /*const { passwordHash, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;*/
  }
}
