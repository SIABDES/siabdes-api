import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { OptionalCommonDeleteDto } from '~common/dto/delete.dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser } from '~modules/v1/auth/decorators';
import {
  AddEmployeeV2Dto,
  AddEmployeeV2Schema,
  GetManyEmployeesV2Dto,
  GetTerV2Dto,
} from '../dto';
import { EmployeesV2Service } from '../services/employees.v2.service';
import { TerV2Service } from '../services/ter.v2.service';

@Controller({
  path: 'employees',
  version: '2',
})
export class EmployeesV2Controller {
  private readonly logger: Logger = new Logger(EmployeesV2Controller.name);

  constructor(
    private readonly service: EmployeesV2Service,
    private readonly terService: TerV2Service,
  ) {}

  @Post()
  async addEmployee(
    @GetUser('unitId') unitId: string,
    @Body(new ZodValidationPipe(AddEmployeeV2Schema)) dto: AddEmployeeV2Dto,
  ) {
    const result = await this.service.addEmployee(unitId, dto);

    this.logger.log(
      `Add employee for unit '${unitId}' with employee ID '${result.id}'`,
    );

    return new ResponseBuilder({
      statusCode: HttpStatus.CREATED,
      data: result,
      message: 'Employee successfully added',
    }).build();
  }

  @Get()
  async getManyEmployees(@Query() dto?: GetManyEmployeesV2Dto) {
    const result = await this.service.getEmployees(dto);

    this.logger.log(`Get many employees`);

    return new ResponseBuilder({
      data: result,
      message: 'Employees successfully fetched',
    }).build();
  }

  @Get(':id')
  async getEmployeeById(@Param('id') id: string) {
    const result = await this.service.getById(id);

    this.logger.log(`Get employee by ID '${id}'`);

    return new ResponseBuilder({
      data: result,
      message: 'Employee successfully fetched',
    }).build();
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AddEmployeeV2Schema)) dto: AddEmployeeV2Dto,
  ) {
    const result = await this.service.updateEmployeeById(id, dto);

    this.logger.log(`Update employee by ID '${id}'`);

    return new ResponseBuilder({
      data: result,
      message: 'Employee successfully updated',
    }).build();
  }

  @Delete(':id')
  async deleteEmployee(
    @Param('id') id: string,
    @Query() deleteDto?: OptionalCommonDeleteDto,
  ) {
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

    return new ResponseBuilder({
      data: result,
      message: 'Employee successfully deleted',
    }).build();
  }

  @Get(':id/ter')
  async getEmployeeTer(
    @Param('id') employeeId: string,
    @Query() dto: GetTerV2Dto,
  ) {
    this.logger.log(`Getting employee TER by ID '${employeeId}'`);

    const result = await this.terService.getTerByEmployeeId({
      ...dto,
      employee_id: employeeId,
    });

    this.logger.log(`Success get employee TER by ID '${employeeId}'`);

    return new ResponseBuilder({
      data: result,
      message: 'Employee TER successfully fetched',
    }).build();
  }
}
