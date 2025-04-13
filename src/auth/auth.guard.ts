import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import Payload from './guard.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string | undefined = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      request['user'] = payload; // { id, username, tokenCreateAt, tokenTimeEndAt }
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization: string | undefined = request.headers.authorization; // ОБЯЗАТЕЛЬНЫЙ ИМПОРТ ИЗ EXPRESSION. Иначе свойства не будет, и нужно будет вызывать вручную.
    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');
    if (type === 'Bearer') {
      return token;
    }
    return undefined;
  }
}
