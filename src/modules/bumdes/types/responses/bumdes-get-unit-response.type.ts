import { BumdesGetUnit } from '../get-unit.type';

export type BumdesGetUnitsResponse = {
  _count: number;
  units: BumdesGetUnit[];
};

export type BumdesGetUnitResponse = BumdesGetUnit;
