import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EmployeesV2Service, TerV2Service } from '../services';
import { ZodValidationPipe } from 'nestjs-zod';
import { OptionalCommonDeleteDto } from '~common/dto';
import { GetUser, HasRoles } from '~modules/v1/auth/decorators';
import {
  AddEmployeeV2Schema,
  AddEmployeeV2Dto,
  GetManyEmployeesV2Dto,
  GetTerV2Dto,
} from '../dto';
import { AuthUserRole } from '@prisma/client';
import { JwtUserPayload } from '~modules/v1/auth/types';

@Controller({
  path: 'units/:unit_id/employees',
  version: '2',
})
@HasRoles(AuthUserRole.UNIT)
export class UnitEmployeesV2Controller {
  private readonly logger: Logger = new Logger(UnitEmployeesV2Controller.name);

  constructor(
    private readonly service: EmployeesV2Service,
    private readonly terService: TerV2Service,
  ) {}

  @Post()
  async addEmployee(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Body(new ZodValidationPipe(AddEmployeeV2Schema)) dto: AddEmployeeV2Dto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    const result = await this.service.addEmployee(unitId, dto);

    this.logger.log(
      `Add employee for unit '${unitId}' with employee ID '${result.id}'`,
    );

    return result;
  }

  @Get()
  async getManyEmployees(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Query() dto?: GetManyEmployeesV2Dto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    const result = await this.service.getEmployees(dto);

    this.logger.log(`Get many employees`);

    return result;
  }

  @Get(':id')
  async getEmployeeById(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Param('id') id: string,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    const result = await this.service.getById(id);

    this.logger.log(`Get employee by ID '${id}'`);

    return result;
  }

  @Put(':id')
  async updateEmployee(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AddEmployeeV2Schema)) dto: AddEmployeeV2Dto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    const result = await this.service.updateEmployeeById(id, dto);

    this.logger.log(`Update employee by ID '${id}'`);

    return result;
  }

  @Delete(':id')
  async deleteEmployee(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Param('id') id: string,
    @Query() deleteDto?: OptionalCommonDeleteDto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    let result;

    if (deleteDto?.hard_delete) {
      result = await this.service.hardDeleteById(id, deleteDto.force);
    } else {
      result = await this.service.softDeleteById(id);
    }

    this.logger.log(
      `Delete employee by ID '${id}' with ${
        deleteDto?.hard_delete ? 'hard' : 'soft'
      } delete`,
    );

    return result;
  }

  @Get(':id/ter')
  async getEmployeeTer(
    @Param('unit_id') unitId: string,
    @GetUser() user: JwtUserPayload,
    @Param('id') employeeId: string,
    @Query() dto: GetTerV2Dto,
  ) {
    if (user.unitId !== unitId) throw new ForbiddenException();

    this.logger.log(`Getting employee TER by ID '${employeeId}'`);

    const result = await this.terService.getTerByEmployeeId({
      ...dto,
      employee_id: employeeId,
    });

    this.logger.log(`Success get employee TER by ID '${employeeId}'`);

    return result;
  }
}
