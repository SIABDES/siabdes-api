import { OptionalPaginationDto } from '~common/dto';
import { WtbFilterDto } from '../dto';
import { GetWtbResponse, GetWtbSummaryResponse } from '../types/responses/';

export interface IWtbService {
  getWtbForUnit(
    unitId: string,
    filter?: WtbFilterDto,
    pagination?: OptionalPaginationDto,
  ): Promise<GetWtbResponse>;

  getWtbSummary(
    unitId: string,
    filter?: WtbFilterDto,
  ): Promise<GetWtbSummaryResponse>;
}
