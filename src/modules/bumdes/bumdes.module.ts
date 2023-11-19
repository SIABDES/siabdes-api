import { Module } from '@nestjs/common';
import { BumdesService, BumdesUnitService } from './services';
import { BumdesController } from './controllers';

@Module({
  providers: [BumdesService, BumdesUnitService],
  controllers: [BumdesController],
  exports: [BumdesService, BumdesUnitService],
})
export class BumdesModule {}
