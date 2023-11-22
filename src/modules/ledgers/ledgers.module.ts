import { Module } from '@nestjs/common';
import { LedgersController } from './controllers';
import { LedgersService } from './services';
import { JournalsModule } from '~modules/journals/journals.module';

@Module({
  controllers: [LedgersController],
  providers: [LedgersService],
  exports: [LedgersService],
  imports: [JournalsModule],
})
export class LedgersModule {}
