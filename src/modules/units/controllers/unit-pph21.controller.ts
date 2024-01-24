import { Controller, Get, HttpStatus, Logger, Param } from '@nestjs/common';
import { ResponseBuilder } from '~common/response.builder';
import { UnitPph21Service } from '../services';

@Controller('units/:unitId/pph21')
export class UnitPph21Controller {
  private logger: Logger = new Logger(UnitPph21Controller.name);

  constructor(private readonly pph21Service: UnitPph21Service) {}

  @Get()
  async getUnitPph21Taxes(@Param('unitId') unitId: string) {
    const result = await this.pph21Service.getTaxes(unitId);

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
  async getUnitPph21TaxDetails(
    @Param('unitId') unitId: string,
    @Param('taxId') taxId: string,
  ) {
    const result = await this.pph21Service.getTaxDetailsById(unitId, taxId);

    this.logger.log(
      `Unit '${unitId}' fetched pph21 tax details with id ${taxId}`,
    );

    return new ResponseBuilder()
      .setData(result)
      .setMessage('PPh21 berhasil ditemukan')
      .setStatusCode(HttpStatus.OK)
      .build();
  }
}
