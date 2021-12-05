import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { recoverUsingWeb3 } from './utils/decorators/request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getSignature(@Query('signature') signature: string, @Query('text') text: string): string {
    return recoverUsingWeb3(text, signature);
  }
}
