import { GetUnit } from '../get-unit.type';

export type GetUnitsResponse = {
  _count: number;
  units: GetUnit[];
};

export type GetUnitResponse = GetUnit;
