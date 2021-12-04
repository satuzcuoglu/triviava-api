import { Module } from '@nestjs/common';

import { CronService } from './cron.service';
import { ContractModule } from 'src/contract/contract.module';
import { DbModule } from 'src/db/db.module';
import { EventModule } from 'src/event/event.module';

@Module({
  imports: [ContractModule, EventModule],
  providers: [CronService]
})
export class CronModule {
  
}
