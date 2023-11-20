import { Module } from '@nestjs/common';
import { GeneralJournalsService } from './services';
import { GeneralJournalsController } from './controllers';

@Module({
  providers: [GeneralJournalsService],
  exports: [GeneralJournalsService],
  controllers: [GeneralJournalsController],
})
export class GeneralJournalsModule {}
