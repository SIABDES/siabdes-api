import { Module } from '@nestjs/common';
import { AdjustmentJournalsController } from './controllers';
import { AdjustmentJournalsService } from './services';

@Module({
  controllers: [AdjustmentJournalsController],
  providers: [AdjustmentJournalsService],
  exports: [AdjustmentJournalsService],
})
export class AdjustmentJournalsModule {}
