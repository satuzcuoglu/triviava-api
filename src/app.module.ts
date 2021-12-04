import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractModule } from './contract/contract.module';
import { QuestionModule } from './question/question.module';
import { EventModule } from './event/event.module';
import { CronModule } from './cron/cron.module';
import { DbModule } from './db/db.module';
import { CryptoModule } from './crypto/crypto.module';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    ContractModule,
    QuestionModule,
    EventModule,
    CronModule,
    DbModule,
    CryptoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
