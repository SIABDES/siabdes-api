import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { AuthUserRole } from '@prisma/client';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import { GetManyEmployeesV2Dto, GetTerV2Dto } from '../dto';
import { EmployeesV2Service } from '../services/employees.v2.service';
import { TerV2Service } from '../services/ter.v2.service';

@Controller({
  path: 'employees',
  version: '2',
})
@HasRoles(AuthUserRole.SUPER_ADMIN)
export class EmployeesV2Controller {
  private readonly logger: Logger = new Logger(EmployeesV2Controller.name);

  constructor(
    private readonly service: EmployeesV2Service,
    private readonly terService: TerV2Service,
  ) {}

  @Get()
  async getManyEmployees(@Query() dto?: GetManyEmployeesV2Dto) {
    const result = await this.service.getEmployees(dto);

    this.logger.log(`Get many employees`);

    return result;
  }

  @Get(':id')
  async getEmployeeById(@Param('id') id: string) {
    const result = await this.service.getById(id);

    this.logger.log(`Get employee by ID '${id}'`);

    return result;
  }

  @Get(':id/ter')
  async getEmployeeTer(
    @Param('id') employeeId: string,
    @Query() dto: GetTerV2Dto,
    @GetUser('unitId') unitId: string,
  ) {
    this.logger.log(`Getting employee TER by ID '${employeeId}'`);

    const result = await this.terService.getTerByEmployeeId({
      ...dto,
      unit_id: unitId,
      employee_id: employeeId,
    });

    this.logger.log(`Success get employee TER by ID '${employeeId}'`);

    return result;
  }
}
