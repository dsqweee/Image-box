import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Request } from 'express';
import { SafeUserDto } from '../dto/safe-result.dto';
import { LoginAuthDto } from '../dto/login-auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<SafeUserDto> {
    const contextId: ContextId = ContextIdFactory.getByRequest(request);
    const authService: AuthService = await this.moduleRef.resolve(
      AuthService,
      contextId,
    );

    const inputUser = new LoginAuthDto();
    inputUser.username = username;
    inputUser.password = password;

    const user: SafeUserDto | null =
      await authService.localValidateUser(inputUser);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
