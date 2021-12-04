import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Event } from 'src/event/event.entity';
import { Option } from 'src/question/option.entity';
import { Question } from 'src/question/question.entity';
import { Validation } from 'src/question/validation.entity';

const NODE_ENV = process.env.NODE_ENV || 'development';

const environmentConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.TRIVIA_DATABASE,
  synchronize: false,
  cache: false,
  logging: false, //NODE_ENV === 'development',
  entities: [Event, Question, Option, Validation],
};

const dbConfig = {
  development: {
    ...environmentConfig,
    host: process.env.DB_HOST || '127.0.0.1',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.TRIVIA_DATABASE || 'triviava'
  },
  production: environmentConfig,
};

export default dbConfig[NODE_ENV];