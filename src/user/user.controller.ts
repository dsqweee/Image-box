import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get')
  getAll() {
    return this.userService.findAll();
  }

  @Get('get/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }

  @Get('get/:username')
  getByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  @Patch('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
