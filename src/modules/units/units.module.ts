import { Module } from '@nestjs/common';
import {
  UnitCapitalsController,
  UnitEmployeesController,
  UnitIncomesController,
  UnitProfileController,
  UnitProfitsController,
  UnitsController,
} from './controllers';
import {
  UnitCapitalsService,
  UnitEmployeesService,
  UnitIncomesService,
  UnitPpnService,
  UnitProfileService,
  UnitProfitsService,
  UnitsService,
} from './services';
import { UnitPpnController } from './controllers/unit-ppn.controller';
import { FilesManagerModule } from '~modules/files_manager/files-manager.module';

@Module({
  providers: [
    UnitsService,
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
    UnitPpnService,
    UnitEmployeesService,
  ],
  controllers: [
    UnitsController,
    UnitProfileController,
    UnitCapitalsController,
    UnitIncomesController,
    UnitProfitsController,
    UnitPpnController,
    UnitEmployeesController,
  ],
  exports: [
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
    UnitPpnService,
    UnitEmployeesService,
  ],
  imports: [FilesManagerModule],
})
export class UnitsModule {}
