import { PaginationDto } from '~common/dto';
import {
  GetLedgerFiltersDto,
  GetLedgerPayloadDto,
  GetLedgerSortDto,
} from '../dto';
import { GetLedgerResponse } from '../types/responses';

export interface ILedgersService {
  getLedger(
    unitId: string,
    data: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    pagination?: PaginationDto,
  ): Promise<GetLedgerResponse>;
}
