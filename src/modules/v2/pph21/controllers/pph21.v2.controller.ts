import { Controller } from '@nestjs/common';
import { Pph21V2Service } from '../services/pph21.v2.service';
import { EmployeesV2Service } from '../services/employees.v2.service';

@Controller({
  path: 'pph21',
  version: '2',
})
export class Pph21V2Controller {
  constructor(
    private readonly pph21Service: Pph21V2Service,
    private readonly employeeService: EmployeesV2Service,
  ) {}
}
