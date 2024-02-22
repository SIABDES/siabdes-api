import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { WtbFilterDto } from '../dto';
import { WtbService } from '../services/wtb.service';

@Controller('wtb')
export class WtbController {
  private logger: Logger = new Logger(WtbController.name);

  constructor(private readonly wtbService: WtbService) {}

  @Get(':unitId')
  async getWtbForUnit(
    @Param('unitId') unitId: string,
    @Query() filter?: WtbFilterDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.wtbService.getWtbForUnit(
      unitId,
      filter,
      pagination,
    );

    this.logger.log(`Get WTB for unit ${unitId}`);
    this.logger.log(`Query Filter: ${JSON.stringify(filter)}`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengambil data list akun WTB')
      .setData(result)
      .build();
  }

  @Get(':unitId/summary')
  async getWtbSummary(
    @Param('unitId') unitId: string,
    @Query() filter?: WtbFilterDto,
  ) {
    const result = await this.wtbService.getWtbSummary(unitId, filter);

    this.logger.log(`Get WTB summary for unit ${unitId}`);
    this.logger.log(`Query Filter: ${JSON.stringify(filter)}`);

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Berhasil mengambil data summary WTB')
      .setData(result)
      .build();
  }
}
