import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { SafeUserDto } from './dto/safe-result.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserService } from '../user/user.service';
import { BcryptService } from './utils/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private passwordService: BcryptService,
  ) {}

  async signIn(signInDto: LoginAuthDto): Promise<{ access_token: string }> {
    const userDb: User | null = await this.userService.findByUsername(
      signInDto.username,
    );

    if (!userDb) {
      throw new UnauthorizedException('Username or Password is incorrect');
    }

    const validatePassword: boolean =
      await this.passwordService.verifyingPassword(
        signInDto.password,
        userDb.password,
      );

    if (!validatePassword) {
      throw new UnauthorizedException('Username or Password is incorrect');
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

  async signUp(registerAuthDto: RegisterAuthDto): Promise<SafeUserDto> {
    const userDb: User | null = await this.userService.findByUsername(
      registerAuthDto.username,
    );

    if (userDb) {
      throw new UnauthorizedException('Username already exists');
    }

    const createdUser: User = await this.userService.create({
      ...registerAuthDto,
    });

    return new SafeUserDto(createdUser.id, createdUser.username);
  }
}
