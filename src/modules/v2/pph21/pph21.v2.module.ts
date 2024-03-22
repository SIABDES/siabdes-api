import { Module, Provider } from '@nestjs/common';
import { EmployeesV2Service, Pph21V2Service, TerV2Service } from './services';
import {
  EmployeesV2Controller,
  Pph21V2Controller,
  TerV2Controller,
  UnitEmployeesV2Controller,
} from './controllers';

const providers: Provider[] = [
  EmployeesV2Service,
  Pph21V2Service,
  TerV2Service,
];

@Module({
  controllers: [
    EmployeesV2Controller,
    Pph21V2Controller,
    TerV2Controller,
    UnitEmployeesV2Controller,
  ],
  providers: providers,
  exports: providers,
})
export class Pph21V2Module {}
