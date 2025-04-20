import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { SafeUserDto } from './dto/safe-result.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() signInDto: LoginAuthDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
  ): Promise<SafeUserDto> {
    return await this.authService.signUp(registerAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: Request & { user: IJwtPayload }): IJwtPayload {
    return req.user;
  }
}
