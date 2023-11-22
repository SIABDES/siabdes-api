import { Module } from '@nestjs/common';
import { LedgersController } from './controllers';
import { LedgersService } from './services';
import { JournalsModule } from '~modules/journals/journals.module';
import { AccountsModule } from '~modules/accounts/accounts.module';

@Module({
  controllers: [LedgersController],
  providers: [LedgersService],
  exports: [LedgersService],
  imports: [JournalsModule, AccountsModule],
})
export class LedgersModule {}
