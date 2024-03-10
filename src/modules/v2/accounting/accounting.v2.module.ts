import { Module } from '@nestjs/common';
import { JournalsV2Controller } from './controllers/journals.v2.controller';
import { JournalsV2Service } from './services/journals.v2.service';

@Module({
  imports: [],
  controllers: [JournalsV2Controller],
  providers: [JournalsV2Service],
  exports: [JournalsV2Service],
})
export class AccountingV2Module {}
