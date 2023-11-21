import { Module } from '@nestjs/common';
import { LedgersController } from './controllers';
import { LedgersService } from './services';

@Module({
  controllers: [LedgersController],
  providers: [LedgersService],
  exports: [],
})
export class LedgersModule {}
