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
import { GetUser } from '~modules/v1/auth/decorators';
import {
  AddUnitEmployeeDto,
  AddUnitEmployeeSchema,
  GetEmployeesFilterDto,
  OptionalTaxesPeriodDto,
  TaxesPeriodDto,
  UpdateUnitEmployeeDto,
  UpdateUnitEmployeeSchema,
} from '../dto';
import { UnitEmployeesService } from '../services';
import { UnitsConfig } from '../units.config';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginationDto } from '~common/dto';

@Controller('units/:unitId/employees')
export class UnitEmployeesController {
  private readonly logger: Logger = new Logger(UnitEmployeesController.name);

  constructor(
    private readonly employeesService: UnitEmployeesService,
    private unitsConfig: UnitsConfig,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(AddUnitEmployeeSchema)) dto: AddUnitEmployeeDto,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.employeesService.addEmployee(unitId, dto);

    this.logger.log(
      `Unit '${unitId}' created employee #${result.id} at ${result.created_at}`,
    );

    return result;
  }

  @Get()
  async getEmployees(
    @GetUser('unitId') unitId: string,
    @Query() filter?: GetEmployeesFilterDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.employeesService.getEmployees(
      unitId,
      filter,
      pagination,
    );

    this.logger.log(
      `Unit '${unitId}' fetched employees with ${result._count} employees`,
    );

    return result;
  }

  @Get(':employeeId')
  async getEmployeeById(
    @GetUser('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
    @Query() taxPeriod?: OptionalTaxesPeriodDto,
  ) {
    const period = taxPeriod || {
      period_month: this.unitsConfig.periodMonth,
      period_years: this.unitsConfig.periodYear,
    };

    const result = await this.employeesService.getEmployeeById(
      unitId,
      employeeId,
      period,
    );

    this.logger.log(
      `Unit '${unitId}' fetched employee with id '${employeeId}'`,
    );

    return result;
  }

  @Put(':employeeId')
  async updateEmployeeById(
    @GetUser('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
    @Body(new ZodValidationPipe(UpdateUnitEmployeeSchema))
    dto: UpdateUnitEmployeeDto,
  ) {
    const result = await this.employeesService.updateEmployee(
      unitId,
      employeeId,
      dto,
    );

    this.logger.log(
      `Unit '${unitId}' updated employee with id '${result.id}' at ${result.updated_at}`,
    );

    return result;
  }

  @Delete(':employeeId')
  async deleteEmployeeById(
    @GetUser('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
  ) {
    const result = await this.employeesService.deleteEmployeeById(
      unitId,
      employeeId,
    );

    this.logger.log(
      `Unit '${unitId}' deleted employee with id '${employeeId}'`,
    );

    return result;
  }

  @Get(':employeeId/ter')
  async getEmployeeTer(
    @Param('employeeId') employeeId: string,
    @Query('gross_salary') grossSalary: string,
    @Query() taxPeriod?: TaxesPeriodDto,
  ) {
    const result = await this.employeesService.getEmployeeTer(
      employeeId,
      Number(grossSalary),
      taxPeriod,
    );

    this.logger.log(`Employee '${employeeId}' fetched ter data: ${result}`);

    return result;
  }
}
