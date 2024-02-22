import { Module } from '@nestjs/common';
import {
  BumdesFundingsService,
  BumdesIncomesService,
  BumdesOrganizationService,
  BumdesProfileService,
} from './services';
import {
  BumdesFundingsController,
  BumdesIncomesController,
  BumdesOrganizationController,
  BumdesProfileController,
} from './controllers';

@Module({
  providers: [
    BumdesProfileService,
    BumdesOrganizationService,
    BumdesFundingsService,
    BumdesIncomesService,
  ],
  controllers: [
    BumdesProfileController,
    BumdesOrganizationController,
    BumdesFundingsController,
    BumdesIncomesController,
  ],
  exports: [BumdesProfileService, BumdesOrganizationService],
})
export class BumdesModule {}
