import { Module } from '@nestjs/common';
import { GeneralJournalsController } from './controllers';
import { GeneralJournalsService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [GeneralJournalsService],
  exports: [GeneralJournalsService],
  controllers: [GeneralJournalsController],
  imports: [],
})
export class GeneralJournalsModule {}
