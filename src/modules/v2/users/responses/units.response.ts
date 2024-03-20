import { UnitDetailsV2, UnitOverviewV2 } from '../types';

export type AddUnitV2Response = {
  id: string;
  created_at: Date;
};

export type GetManyUnitsV2Response = {
  _count: number;
  units: UnitOverviewV2[];
};

export type GetUnitDetailsV2Response = UnitDetailsV2;

export type DeleteUnitV2Response = {
  id: string;
  deleted_at: Date;
  hard_delete: boolean;
};
