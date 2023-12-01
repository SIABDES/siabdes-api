import { Module } from '@nestjs/common';
import { UnitsService } from './services';
import { UnitsController } from './controllers';

@Module({
  providers: [UnitsService],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule {}
