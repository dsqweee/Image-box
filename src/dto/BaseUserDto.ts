import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  NotContains,
} from 'class-validator';

export class BaseUserDto {
  @IsString({ message: 'The login should be a string' })
  @Length(3, 32, {
    message: 'The login length should be between 3 and 32 characters long',
  })
  @NotContains(' ', {
    message: 'The login must not contain spaces',
  })
  @IsNotEmpty({ message: 'The login length should not be empty' })
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Login must contain only Latin characters (A-Z, a-z)',
  })
  username: string;

  @IsString({ message: 'The password should be a string' })
  @Length(8, 32, {
    message: 'The password length should be between 8 and 32 characters long',
  })
  @NotContains(' ', {
    message: 'The password must not contain spaces',
  })
  @IsNotEmpty({ message: 'The password length should not be empty' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?]*$/, {
    message:
      'The password must contain only Latin characters, numbers and special characters (A-Z, a-z) (0-9) (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)',
  })
  password: string;

  @IsInt()
  @Min(6)
  @Max(120)
  age: number;
}
