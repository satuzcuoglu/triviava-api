import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/crypto/crypto.module';
import { Validation } from './validation.entity';
import { ContractModule } from 'src/contract/contract.module';

@Module({
  imports : [
    CryptoModule,
    ContractModule,
    TypeOrmModule.forFeature([Question, Option, Validation]),
  ],
  providers: [QuestionService],
  controllers: [QuestionController],
  exports: [QuestionService]
})
export class QuestionModule {}
