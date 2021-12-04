import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { EventService } from 'src/event/event.service';

@Injectable()
export class CronService {
  constructor(private readonly eventService: EventService) {}

  @Cron('*/15 * * * * *')
  async checkFinishedEvents() {
    const finishedEvents = await this.eventService.getEventsForFinishing();
    for (const event of finishedEvents) {
      await this.eventService.finishEvent(event);
    }
  }
}
