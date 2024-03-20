import { Module } from '@nestjs/common';
import { JournalsV2Service, LedgersV2Service, WtbV2Service } from './services';
import {
  JournalsV2Controller,
  UnitJournalsV2Controller,
  UnitLedgersV2Controller,
  UnitWtbV2Controller,
} from './controllers';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5000, // 5 seconds
    }),
  ],
  controllers: [
    JournalsV2Controller,
    UnitJournalsV2Controller,
    UnitLedgersV2Controller,
    UnitWtbV2Controller,
  ],
  providers: [JournalsV2Service, LedgersV2Service, WtbV2Service],
  exports: [JournalsV2Service, LedgersV2Service, WtbV2Service],
})
export class AccountingV2Module {}
