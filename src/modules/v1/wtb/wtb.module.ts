import { Module } from '@nestjs/common';
import { WtbService } from './services/wtb.service';
import { WtbController } from './controllers/wtb.controller';

@Module({
  providers: [WtbService],
  controllers: [WtbController],
  exports: [WtbService],
})
export class WtbModule {}
