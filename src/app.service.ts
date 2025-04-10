import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Test) readonly testRepository: Repository<Test>,
  ) {}

  async getHello(): Promise<{ newData: Test }> {
    const data: Test[] = await this.testRepository.find();
    await this.testRepository.remove(data);

    const newData: Test = this.testRepository.create({
      name: 'test',
    });

    return { newData };
  }
}
