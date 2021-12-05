import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GetWalletAddress } from 'src/utils/decorators/request';
import { CreateEventDTO } from './event.dto';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService){}

  @Post()
  async createEvent(@Body() dto: CreateEventDTO) {
    const event = await this.eventService.createEvent(dto);
    return event;
  }

  @Post('/:id/finish')
  async finishEvent(@Param('id') id: number) {
    const event = await this.eventService.findById(id);
    await this.eventService.finishEvent(event);
  }

  @Get('/upcoming')
  async getUpcomingEvents() {
    const events = await this.eventService.getUpcomingEvents();
    return events.map((e) => ({
      ...e,
      questions: e.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
        })),
      })),
    }));
  }

  @Get('/active')
  async getActiveEvents(@GetWalletAddress() address: string) {
    const events = await this.eventService.getActiveEvents(address);
    return events.map((e) => ({
      ...e,
      questions: e.questions.map((q) => ({
        ...q,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
        })),
      })),
    }));
  }
}
