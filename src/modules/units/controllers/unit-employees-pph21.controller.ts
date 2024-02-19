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
import { ResponseBuilder } from '~common/response.builder';
import {
  AddUnitEmployeePph21Dto,
  AddUnitEmployeePph21Schema,
  OptionalTaxesPeriodDto,
  UpdateUnitEmployeePph21Dto,
  UpdateUnitEmployeePph21Schema,
} from '../dto';
import { UnitPph21Service } from '../services';

@Controller('units/:unitId/employees/:employeeId/pph21')
export class UnitEmployeesPph21Controller {
  private logger: Logger = new Logger(UnitEmployeesPph21Controller.name);

  constructor(private readonly pph21Service: UnitPph21Service) {}

  @Post()
  async addTax(
    @Param('unitId') unitId: string,
    @Param('employeeId') employeeId: string,
    @Body(new ZodValidationPipe(AddUnitEmployeePph21Schema))
    dto: AddUnitEmployeePph21Dto,
  ) {
    const result = await this.pph21Service.addTax(unitId, employeeId, dto);

    this.logger.log(
      `Tax with id ${result.id} successfully added for employee ${employeeId}`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditambahkan')
      .setStatusCode(HttpStatus.CREATED)
      .build();
  }

  @Get(':taxId')
  async getTaxDetailsById(
    @Param('taxId') taxId: string,
    @Param('employeeId') employeeId: string,
    @Param('unitId') unitId: string,
  ) {
    const result = await this.pph21Service.getTaxDetailsById(
      unitId,
      employeeId,
      taxId,
    );

    this.logger.log(`Tax with id ${taxId} successfully retrieved`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Get()
  async getEmployeeTaxes(
    @Param('employeeId') employeeId: string,
    @Param('unitId') unitId: string,
    @Query() taxPeriodDto?: OptionalTaxesPeriodDto,
  ) {
    const result = await this.pph21Service.getEmployeesTaxes(
      unitId,
      employeeId,
      taxPeriodDto,
    );

    this.logger.log(
      `Taxes for employee with id ${employeeId} successfully retrieved`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil diambil')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Put(':taxId')
  async updateTax(
    @Param('employeeId') employeeId: string,
    @Param('taxId') taxId: string,
    @Body(new ZodValidationPipe(UpdateUnitEmployeePph21Schema))
    dto: UpdateUnitEmployeePph21Dto,
  ) {
    const result = await this.pph21Service.updateTax(employeeId, taxId, dto);

    this.logger.log(`Tax with id ${taxId} successfully updated`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditambahkan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Delete(':taxId')
  async deleteTax(@Param('taxId') taxId: string) {
    await this.pph21Service.deleteTax(taxId);

    this.logger.log(`Tax with id ${taxId} successfully deleted`);

    return new ResponseBuilder()
      .setMessage('PPh21 berhasil ditambahkan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
