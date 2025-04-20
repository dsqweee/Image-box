import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async verifyingPassword(
    inputPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
