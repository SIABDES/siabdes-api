import { Controller, Get, Logger, Query } from '@nestjs/common';
import { TerV2Service } from '../services/ter.v2.service';
import { GetTerV2Dto } from '../dto';
import { GetTerV2Response } from '../responses';
import { ResponseBuilder } from '~common/response.builder';

@Controller({
  path: 'pph21-ter',
  version: '2',
})
export class TerV2Controller {
  private readonly logger: Logger = new Logger(TerV2Controller.name);

  constructor(private readonly service: TerV2Service) {}

  @Get()
  async getTer(@Query() dto: GetTerV2Dto) {
    let result: GetTerV2Response;

    this.logger.log(`Get Ter with query: ${JSON.stringify(dto)}`);

    if (dto.ter_type) {
      result = await this.service.getTerByTerType(dto);
    } else if (dto.ptkp_status) {
      result = await this.service.getTerByPtkpStatus(dto);
    }

    this.logger.log(`Get Ter result: ${JSON.stringify(result)}`);

    return new ResponseBuilder({
      message: 'Get Ter successfully',
      data: result,
    }).build();
  }
}
