import { PickType } from '@nestjs/mapped-types';
import { BaseUserDto } from '../../dto/BaseUserDto';

export class CreateUserDto extends PickType(BaseUserDto, [
  'username',
  'password',
  'age',
] as const) {}
