import { Module } from '@nestjs/common';
import {
  UnitCapitalsController,
  UnitIncomesController,
  UnitProfileController,
  UnitProfitsController,
  UnitsController,
} from './controllers';
import {
  UnitCapitalsService,
  UnitIncomesService,
  UnitProfileService,
  UnitProfitsService,
  UnitsService,
} from './services';

@Module({
  providers: [
    UnitsService,
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
  ],
  controllers: [
    UnitsController,
    UnitProfileController,
    UnitCapitalsController,
    UnitIncomesController,
    UnitProfitsController,
  ],
  exports: [
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
  ],
})
export class UnitsModule {}
