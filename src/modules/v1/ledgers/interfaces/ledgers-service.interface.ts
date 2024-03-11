import { OptionalPaginationDto } from '~common/dto';
import {
  GetLedgerFiltersDto,
  GetLedgerPayloadDto,
  GetLedgerSortDto,
} from '../dto';
import { GetLedgerResponse } from '../types/responses';

export interface ILedgersService {
  getLedger(
    bumdesId: string,
    accountId: number,
    payload: GetLedgerPayloadDto,
    sort: GetLedgerSortDto,
    filters: GetLedgerFiltersDto,
    unitId?: string,
    pagination?: OptionalPaginationDto,
  ): Promise<GetLedgerResponse>;
}
