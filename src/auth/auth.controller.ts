import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthGuard } from './auth.guard';
import Payload from './guard.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.login(loginAuthDto);
  }

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto): Promise<string> {
    return await this.authService.register(registerAuthDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: Payload }) {
    return req.user;
  }
}
