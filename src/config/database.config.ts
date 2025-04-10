import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as process from 'node:process';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.js, .ts}'],
  }),
);
