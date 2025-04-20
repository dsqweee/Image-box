import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from '../../dto/BaseUserDto';

export class LoginAuthDto extends PickType(BaseUserDto, [
  'username',
  'password',
]) {}
