import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from '@prisma/client';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { IUserToken } from './interfaces/user-token.interface';
import { SafeUserDto } from './dto/safe-result.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: Request & { user: User }): Promise<IUserToken> {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<SafeUserDto> {
    return await this.authService.register(registerAuthDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request & { user: IJwtPayload }): IJwtPayload {
    return req.user;
  }
}
