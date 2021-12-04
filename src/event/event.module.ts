import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { DbModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { QuestionModule } from 'src/question/question.module';
import { ContractModule } from 'src/contract/contract.module';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    DbModule,
    QuestionModule,
    ContractModule,
    CryptoModule,
    TypeOrmModule.forFeature([Event]),
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService]
})
export class EventModule {}
