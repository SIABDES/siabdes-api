import { Module } from '@nestjs/common';
import { UnitProfileController, UnitsController } from './controllers';
import { UnitProfileService, UnitsService } from './services';

@Module({
  providers: [UnitsService, UnitProfileService],
  controllers: [UnitsController, UnitProfileController],
  exports: [UnitProfileService],
})
export class UnitsModule {}
