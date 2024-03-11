import { PaginationResponse } from '~common/responses';
import { GetUnit } from '../get-unit.type';

export type GetUnitsResponse = PaginationResponse & {
  _count: number;
  units: GetUnit[];
};

export type GetUnitResponse = GetUnit;
