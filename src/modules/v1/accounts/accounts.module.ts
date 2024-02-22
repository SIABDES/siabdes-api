import { Module } from '@nestjs/common';
import { AccountsController } from './controllers';
import { AccountsService } from './services';

@Module({
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
