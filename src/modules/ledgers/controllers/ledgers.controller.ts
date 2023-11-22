import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { ResponseBuilder } from '~common/response.builder';
import { GetUser } from '~modules/auth/decorators';
import { GetLedgerFiltersDto, GetLedgerPayloadDto } from '../dto';
import { GetLedgerSortDto } from '../dto/get-ledger-sort.dto';
import { LedgersService } from '../services';

@Controller('ledgers')
export class LedgersController {
  constructor(private readonly ledgersService: LedgersService) {}

  @Get()
  async getLedger(
    @GetUser('unitId') unitId: string,
    @Query() payload: GetLedgerPayloadDto,
    @Query() filters: GetLedgerFiltersDto,
    @Query() sort?: GetLedgerSortDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.ledgersService.getLedger(
      unitId,
      payload,
      sort,
      filters,
      pagination,
    );

    return new ResponseBuilder()
      .setStatusCode(HttpStatus.OK)
      .setMessage('Success')
      .setData(result)
      .build();
  }
}
