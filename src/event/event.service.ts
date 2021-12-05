import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import moment from 'moment';
import _ from 'lodash';
import { Event } from './event.entity';
import { CreateEventDTO } from './event.dto';
import { QuestionService } from 'src/question/question.service';
import { ContractService } from 'src/contract/contract.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly questionService: QuestionService,
    private readonly contractService: ContractService,
  ) {}


  async findById(eventId: number) {
    const event = await this.eventRepository.findOne(eventId);
    return event;
  }

  async createEvent(data: CreateEventDTO) {
    const questions = await this.questionService.getUnusedQuestionsByLanguageAndCount(
      data.language,
      data.questionCount,
    );
    if (data.questionCount === 0) {
      throw new HttpException(
        `Question Count must be greater than 0`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (questions.length < data.questionCount) {
      throw new HttpException(
        `There aren't enough question registered`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let event = new Event();
    event.startDate = data.startDate;
    event.endDate = moment()
      .add(data.questionCount * 15, 'seconds')
      .toDate();
    event.language = data.language;
    event.entryFee = data.joinFee;

    event = await this.eventRepository.save(event);
    for (const question of questions) {
      // const validators = await this.contractService.getValidatorsByQuestionId(
      //   question.id,
      // );
      // if (validators.length > 2) {
      //   await this.questionService.assignQuestionToEvent(question.id, event.id);
      // }
      await this.questionService.assignQuestionToEvent(question.id, event.id);
    }
    await this.contractService.createQuiz(event, questions, data.joinFee);
  }

  async finishEvent(event: Event) {
    const options = await this.questionService.getCorrectOptionsByEventId(
      event.id,
    );
    event.isFinished = true;
    await this.contractService.finalizeQuiz(event.id, options);
    this.eventRepository.save(event);
  }

  async getUpcomingEvents() {
    const events = await this.eventRepository.find({
      where: {
        startDate: MoreThan(moment().toDate()),
        endDate: LessThan(moment().add(3, 'hours').toDate()),
      },
      relations: ['questions', 'questions.options'],
      order: { createdAt: `DESC` },
    });
    return events.map((event) => ({
      ...event,
      questions: _.sortBy(event.questions, 'createdAt'),
    }));
  }

  async getActiveEvents(walletAddress: string) {
    const activeEvents = await this.eventRepository.find({
      where: {
        endDate: MoreThanOrEqual(moment().toDate()),
        startDate: LessThan(moment().toDate()),
      },
      relations: ['questions', 'questions.options'],
    });

    const availableEvents = [];
    for (const event of activeEvents) {
      const participants = await this.contractService.getParticipantsByEventId(
        event.id,
      );
      if (participants.find((p) => p === walletAddress)) {
        availableEvents.push(event);
      }
    }

    return availableEvents.map((event) => ({
      ...event,
      questions: _.sortBy(event.questions, 'createdAt'),
    }));
  }

  async getEventsForFinishing() {
    return await this.eventRepository.find({
      where: {
        endDate: moment()
          .set('s', 0)
          .set('ms', 0)
          .toDate(),
      },
      relations: ['questions'],
    });
  }

  async getEventsForStarting() {
    return await this.eventRepository.find({
      where: {
        startDate: moment()
          .set('s', 0)
          .set('ms', 0)
          .toDate(),
      },
      relations: ['questions'],
    });
  }
}
