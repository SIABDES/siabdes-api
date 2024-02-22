import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ResponseBuilder } from '~common/response.builder';
import { UnitPph21Service } from '../services';
import { OptionalTaxesPeriodDto } from '../dto';

@Controller('units/:unitId/pph21')
export class UnitPph21Controller {
  private logger: Logger = new Logger(UnitPph21Controller.name);

  constructor(private readonly pph21Service: UnitPph21Service) {}

  @Get()
  async getUnitPph21Taxes(
    @Param('unitId') unitId: string,
    @Query() taxPeriodDto: OptionalTaxesPeriodDto,
  ) {
    const result = await this.pph21Service.getTaxes(unitId, taxPeriodDto);

    this.logger.log(
      `Unit '${unitId}' fetched pph21 taxes with ${result._count} taxes`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Get(':taxId')
  async getUnitPph21Tax(
    @Param('unitId') unitId: string,
    @Param('taxId') taxId: string,
  ) {
    const result = await this.pph21Service.getTaxDetailsById(unitId, taxId);

    this.logger.log(`Unit '${unitId}' fetched pph21 tax '${taxId}'`);

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }

  @Delete(':taxId')
  async deleteTax(@Param('taxId') taxId: string) {
    const result = await this.pph21Service.deleteTax(taxId);

    this.logger.log(`Tax with id ${taxId} successfully deleted`);

    return new ResponseBuilder()
      .setMessage('PPh21 berhasil dihapus')
      .setStatusCode(HttpStatus.OK)
      .setData(result)
      .build();
  }
}
