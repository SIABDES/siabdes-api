import { Module } from '@nestjs/common';
import { EmployeesV2Service } from './services/employees.v2.service';
import { Pph21V2Service } from './services/pph21.v2.service';
import { EmployeesV2Controller } from './controllers/employees.v2.controller';
import { Pph21V2Controller } from './controllers/pph21.v2.controller';

@Module({
  controllers: [EmployeesV2Controller, Pph21V2Controller],
  providers: [EmployeesV2Service, Pph21V2Service],
})
export class Pph21V2Module {}
