import { Module, Provider } from '@nestjs/common';
import {
  AccountsV2Service,
  JournalsV2Service,
  LedgersV2Service,
  WtbV2Service,
} from './services';
import {
  AccountsV2Controller,
  JournalsV2Controller,
  UnitJournalsV2Controller,
  UnitLedgersV2Controller,
  UnitWtbV2Controller,
} from './controllers';
import { CacheModule } from '@nestjs/cache-manager';
import { LedgersV2Repository } from './repositories';

const providers: Provider[] = [
  JournalsV2Service,
  LedgersV2Service,
  WtbV2Service,
  LedgersV2Repository,
  AccountsV2Service,
];

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
    AccountsV2Controller,
  ],
  providers: providers,
  exports: providers,
})
export class AccountingV2Module {}
