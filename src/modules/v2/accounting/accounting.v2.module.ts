import { Module } from '@nestjs/common';
import { JournalsV2Service, LedgersV2Service } from './services';
import {
  JournalsV2Controller,
  UnitJournalsV2Controller,
  UnitLedgersV2Controller,
} from './controllers';

@Module({
  imports: [],
  controllers: [
    JournalsV2Controller,
    UnitJournalsV2Controller,
    UnitLedgersV2Controller,
  ],
  providers: [JournalsV2Service, LedgersV2Service],
  exports: [JournalsV2Service, LedgersV2Service],
})
export class AccountingV2Module {}
