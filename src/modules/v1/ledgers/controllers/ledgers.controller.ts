import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PaginationDto } from '~common/dto';
import { GetUser } from '~modules/v1/auth/decorators';
import { GetLedgerFiltersDto, GetLedgerPayloadDto } from '../dto';
import { GetLedgerSortDto } from '../dto/get-ledger-sort.dto';
import { LedgersService } from '../services';

@Controller('ledgers')
export class LedgersController {
  private logger: Logger = new Logger(LedgersController.name);

  constructor(private readonly ledgersService: LedgersService) {}

  @Get(':accountId')
  async getLedger(
    @GetUser('bumdesId') bumdesId: string,
    @Param('accountId', ParseIntPipe) accountId: number,
    @Query() payload: GetLedgerPayloadDto,
    @GetUser('unitId') unitId?: string,
    @Query() filters?: GetLedgerFiltersDto,
    @Query() sort?: GetLedgerSortDto,
    @Query() pagination?: PaginationDto,
  ) {
    const result = await this.ledgersService.getLedger(
      bumdesId,
      accountId,
      payload,
      sort,
      filters,
      unitId,
      pagination,
    );

    this.logger.log(`Get ledger for unit ${unitId}`);
    this.logger.log(`Query Payload: ${JSON.stringify(payload)}`);
    this.logger.log(`Query Filters: ${JSON.stringify(filters)}`);
    this.logger.log(`Query Sort: ${JSON.stringify(sort)}`);
    this.logger.log(`Query Pagination: ${JSON.stringify(pagination)}`);

    return result;
  }
}
