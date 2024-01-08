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
} from '@nestjs/common';
import { UnitEmployeesService } from '../services';
import { AddUnitEmployeeDto, UpdateUnitEmployeeDto } from '../dto';
import { GetUser } from '~modules/auth/decorators';
import { ResponseBuilder } from '~common/response.builder';

@Controller('units/:unitId/employees')
export class UnitEmployeesController {
  private readonly logger: Logger = new Logger(UnitEmployeesController.name);

  constructor(private readonly employeesService: UnitEmployeesService) {}

  @Post()
  async create(
    @Body() dto: AddUnitEmployeeDto,
    @GetUser('unitId') unitId: string,
  ) {
    const result = await this.employeesService.addEmployee(unitId, dto);

    this.logger.log(
      `Unit '${unitId}' created employee #${result.id} at ${result.created_at}`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Pegawai berhasil ditambahkan')
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }

  @Get()
  async getEmployees(@GetUser('unitId') unitId: string) {
    const result = await this.employeesService.getEmployees(unitId);

    this.logger.log(
      `Unit '${unitId}' fetched employees with ${result._count} employees`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Pegawai berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Get(':employeeId')
  async getEmployeeById(
    @GetUser('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
  ) {
    const result = await this.employeesService.getEmployeeById(
      unitId,
      employeeId,
    );

    this.logger.log(
      `Unit '${unitId}' fetched employee with id '${employeeId}'`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Pegawai berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Put(':employeeId')
  async updateEmployeeById(
    @GetUser('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
    @Body() dto: UpdateUnitEmployeeDto,
  ) {
    const result = await this.employeesService.updateEmployee(
      unitId,
      employeeId,
      dto,
    );

    this.logger.log(
      `Unit '${unitId}' updated employee with id '${result.id}' at ${result.updated_at}`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Pegawai berhasil diperbarui')
      .setStatusCode(HttpStatus.OK)
      .build();
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

    return new ResponseBuilder()
      .setData(result)
      .setMessage('Pegawai berhasil dihapus')
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
