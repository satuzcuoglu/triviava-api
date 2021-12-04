import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dbConfig from './db.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: dbConfig.type,
      host: dbConfig.host,
      database: dbConfig.database,
      port: 3306,
      username: dbConfig.username,
      password: dbConfig.password,
      logging: dbConfig.logging,
      synchronize: true,
      keepConnectionAlive: true,
      entities: dbConfig.entities,
      supportBigNumbers: true,
      bigNumberStrings: false,
      extra: {
        decimalNumbers: true,
      },
    }),
  ],
})
export class DbModule {}
