import { Module } from '@nestjs/common';
import { BumdesOrganizationService, BumdesProfileService } from './services';
import {
  BumdesOrganizationController,
  BumdesProfileController,
} from './controllers';

@Module({
  providers: [BumdesProfileService, BumdesOrganizationService],
  controllers: [BumdesProfileController, BumdesOrganizationController],
  exports: [BumdesProfileService, BumdesOrganizationService],
})
export class BumdesModule {}
