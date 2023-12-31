import { Module } from '@nestjs/common';
import { AccountsModule } from '~modules/accounts/accounts.module';
import { LedgersController } from './controllers';
import { LedgersService } from './services';

@Module({
  controllers: [LedgersController],
  providers: [LedgersService],
  exports: [LedgersService],
  imports: [AccountsModule],
})
export class LedgersModule {}
