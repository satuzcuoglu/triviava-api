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

  @Get()
  async getEvents(@GetWalletAddress() address: string) {
    const events = await this.eventService.getEvents(address);
    return events;
  }

  @Get('/:id/results')
  async getEventResults(@Param('id') eventId: string ) {
    const event = await this.eventService.getResultsByEventId(eventId);
    return event;
  }

}
