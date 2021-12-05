import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import _ from 'lodash';

import { CreateQuestionDTO } from './question.dto';
import { Question } from './question.entity';
import { Option } from './option.entity';
import { Validation } from './validation.entity';
import { ContractService } from 'src/contract/contract.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(Validation)
    private readonly validationRepository: Repository<Validation>,
    private readonly contractService: ContractService,
  ) {}

  async createQuestion(data: CreateQuestionDTO, creatorAddress: string) {
    console.log(data);
    let question = new Question();
    question.id = await this.contractService.calculateQuestionHash(
      data.text,
      creatorAddress,
    );
    question.text = data.text;
    question.language = data.language;
    question.creatorAddress = creatorAddress;
    question = await this.questionRepository.save(question);

    for (const opt of data.options) {
      const option = new Option();
      option.id = await this.contractService.calcualateOptionHash(
        question.id,
        opt.text,
        opt.isCorrect,
        creatorAddress,
      );
      option.text = opt.text;
      option.questionId = question.id;
      option.isCorrect = opt.isCorrect;
      await this.optionRepository.save(option);
    }
    return question;
  }

  async getQuestionForValidation(validatorAddress: string): Promise<Question> {
    const questions = await this.questionRepository.find({
      where: { eventId: null },
      relations: ['options', 'validations'],
    });

    const question = questions.find(
      (q) =>
        q.validations.findIndex(
          (v) => v.validatorAddress === validatorAddress,
        ) === -1,
    );
    return question;
  }

  async getUnusedQuestionsByLanguageAndCount(language: string, count: number) {
    const questions = await this.questionRepository.find({
      where: { language, eventId: null },
      take: count,
    });

    return questions;
  }

  async getCorrectOptionsByEventId(eventId: number): Promise<Option[]> {
    const questions = await this.questionRepository.find({
      where: { eventId },
      relations: ['options'],
      order: { createdAt: `ASC` },
    });
    const options = [];
    questions.forEach((q) => {
      const option = q.options.find((o) => o.isCorrect === true);
      options.push(option);
    });
    return options;
  }

  async assignQuestionToEvent(questionId: string, eventId: number) {
    const question = await this.questionRepository.findOne(questionId);
    question.eventId = eventId;
    await this.questionRepository.save(question);
  }
}
