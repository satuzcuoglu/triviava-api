import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetWalletAddress } from 'src/utils/decorators/request';
import { CreateQuestionDTO } from './question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  async createQuestion(
    @Body() dto: CreateQuestionDTO,
    @GetWalletAddress() address: string,
  ) {
    const question = await this.questionService.createQuestion(dto, address);
    return question;
  }

  @Get()
  async getQuestionForValidation(@GetWalletAddress() address: string) {
    const question = await this.questionService.getQuestionForValidation(
      address,
    );
    if (question) {
      const { validations, ...pureQuestion } = question;
      return pureQuestion;
    }
    return null;
  }
}
