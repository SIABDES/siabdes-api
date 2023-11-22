import { PaginationDto } from '~common/dto';
import { GetLedgerFiltersDto, GetLedgerSortDto } from '../dto';
import { GetLedgerResponse } from '../types/responses';

export interface ILedgersService {
  getLedger(
    unitId: string,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse>;
}
