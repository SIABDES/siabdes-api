import { Module } from '@nestjs/common';
import {
  UnitCapitalsController,
  UnitEmployeesController,
  UnitEmployeesPph21Controller,
  UnitIncomesController,
  UnitPph21Controller,
  UnitPpnController,
  UnitProfileController,
  UnitProfitsController,
  UnitsController,
} from './controllers';
import {
  UnitCapitalsService,
  UnitEmployeesService,
  UnitIncomesService,
  UnitPph21Service,
  UnitPpnService,
  UnitProfileService,
  UnitProfitsService,
  UnitsService,
} from './services';
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
    UnitPph21Service,
  ],
  controllers: [
    UnitsController,
    UnitProfileController,
    UnitCapitalsController,
    UnitIncomesController,
    UnitProfitsController,
    UnitPpnController,
    UnitEmployeesController,
    UnitPph21Controller,
    UnitEmployeesPph21Controller,
  ],
  exports: [
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
    UnitPpnService,
    UnitEmployeesService,
    UnitPph21Service,
  ],
  imports: [FilesManagerModule],
})
export class UnitsModule {}
