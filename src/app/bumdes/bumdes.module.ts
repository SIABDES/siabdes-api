import { Module } from '@nestjs/common';
import { BumdesService } from './bumdes.service';
import { BumdesController } from './bumdes.controller';

@Module({
  providers: [BumdesService],
  controllers: [BumdesController],
  exports: [BumdesService],
})
export class BumdesModule {}
