import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import moment from 'moment';
import { Event } from './event.entity';
import { CreateEventDTO } from './event.dto';
import { QuestionService } from 'src/question/question.service';
import { ContractService } from 'src/contract/contract.service';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private readonly questionService: QuestionService,
    private readonly contractService: ContractService,
    private readonly cryptoService: CryptoService,
  ) {}

  async createEvent(data: CreateEventDTO) {
    const questions =
      await this.questionService.getUnusedQuestionsByLanguageAndCount(
        data.language,
        data.questionCount,
      );
    if (data.questionCount === 0) {
      throw new HttpException(`Question Count must be greater than 0`, HttpStatus.BAD_REQUEST);
    }

    if (questions.length < data.questionCount) {
      throw new HttpException(`There aren't enough question registered`, HttpStatus.BAD_REQUEST);
    }

    let event = new Event();
    event.startDate = data.startDate;
    event.endDate = moment().add(data.questionCount * 15 ,'seconds').toDate();
    event.language = data.language;
    event = await this.eventRepository.save(event);
    for (const question of questions) {
      await this.questionService.assignQuestionToEvent(question.id, event.id);
    }
    await this.contractService.createQuiz(event, questions);
  }

  async finishEvent(event: Event) {
    const options = await this.questionService.getCorrectOptionsByEventId(event.id);
    await this.contractService.finalizeQuiz(event.id, options);
  }

  async getEvents(walletAddress: string) {
    const events = await this.eventRepository.find({
      where: {
        endDate: MoreThanOrEqual(moment().toDate()),
        startDate: LessThan(moment().toDate())
      }
    });

    // const question = events.filter(q => q.participants.findIndex(p => p.walletAddress === walletAddress) !== -1);
    return events;


  }

  async getEventsForFinishing() {
    return await this.eventRepository.find({
      where: {
        endDate: moment().set('s', 0).set('ms', 0).toDate(),
      },
      relations:['questions']
    });
  }

  async getEventsForStarting() {
    return await this.eventRepository.find({
      where: {
        startDate: moment().set('s', 0).set('ms', 0).toDate(),
      },
      relations:['questions']
    });
  }

  async getResultsByEventId(eventId: string) {

  }
}
