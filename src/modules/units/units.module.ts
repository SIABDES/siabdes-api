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
  ],
  controllers: [
    UnitsController,
    UnitProfileController,
    UnitCapitalsController,
    UnitIncomesController,
    UnitProfitsController,
    UnitPpnController,
  ],
  exports: [
    UnitProfileService,
    UnitCapitalsService,
    UnitIncomesService,
    UnitProfitsService,
    UnitPpnService,
  ],
  imports: [FilesManagerModule],
})
export class UnitsModule {}
