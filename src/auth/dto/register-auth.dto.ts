import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from '../../dto/BaseUserDto';

export class RegisterAuthDto extends PickType(BaseUserDto, [
  'username',
  'password',
  'age',
] as const) {}
