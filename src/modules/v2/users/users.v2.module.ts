import { Module } from '@nestjs/common';
import { BumdesV2Service, UnitV2Service } from './services';
import {
  BumdesUnitsV2Controller,
  BumdesV2Controller,
  UnitsV2Controller,
} from './controllers';

@Module({
  controllers: [UnitsV2Controller, BumdesV2Controller, BumdesUnitsV2Controller],
  providers: [UnitV2Service, BumdesV2Service],
  exports: [UnitV2Service, BumdesV2Service],
})
export class UsersV2Module {}
