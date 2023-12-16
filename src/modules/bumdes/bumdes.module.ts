import { Module } from '@nestjs/common';
import {
  BumdesFundingsService,
  BumdesOrganizationService,
  BumdesProfileService,
} from './services';
import {
  BumdesFundingsController,
  BumdesOrganizationController,
  BumdesProfileController,
} from './controllers';

@Module({
  providers: [
    BumdesProfileService,
    BumdesOrganizationService,
    BumdesFundingsService,
  ],
  controllers: [
    BumdesProfileController,
    BumdesOrganizationController,
    BumdesFundingsController,
  ],
  exports: [BumdesProfileService, BumdesOrganizationService],
})
export class BumdesModule {}
