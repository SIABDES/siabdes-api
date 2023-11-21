import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { LedgersService } from '../services';
import { GetLedgerFiltersDto, GetLedgerPayloadDto } from '../dto';
import { GetLedgerSortDto } from '../dto/get-ledger-sort.dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser } from '~modules/auth/decorators';

@Controller('ledgers')
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @Get()
  async getLedger(
    @GetUser('unitId') unitId: string,
    @Query() data: GetLedgerPayloadDto,
    @Query() sort: GetLedgerSortDto,
    @Query() filters: GetLedgerFiltersDto,
  ) {
    const result = await this.ledgersService.getLedger(
      unitId,
      data,
      sort,
      filters,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Success')
      .setData(result)
      .build();
  }
}
