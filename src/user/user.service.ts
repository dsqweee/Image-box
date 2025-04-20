import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';
import { BcryptService } from '../auth/utils/bcrypt.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly passwordService: BcryptService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isAny: User | null = await this.prisma.user.findFirst({
      where: { username: createUserDto.username },
    });

    if (isAny) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword: string = await this.passwordService.hashPassword(
      createUserDto.password,
    );

    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hashedPassword,
        age: createUserDto.age,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { username: username },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const isAny: User | null = await this.prisma.user.findFirst({
      where: { id: id },
    });

    if (!isAny) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number): Promise<User> {
    const isAny: User | null = await this.prisma.user.findFirst({
      where: { id: id },
    });

    if (!isAny) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.delete({
      where: { id: id },
    });
  }
}
