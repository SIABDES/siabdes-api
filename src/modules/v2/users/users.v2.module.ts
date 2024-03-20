import { Module } from '@nestjs/common';
import { UnitV2Service } from './services';
import { BumdesUnitsV2Controller, UnitsV2Controller } from './controllers';

@Module({
  controllers: [UnitsV2Controller, BumdesUnitsV2Controller],
  providers: [UnitV2Service],
  exports: [UnitV2Service],
})
export class UsersV2Module {}
