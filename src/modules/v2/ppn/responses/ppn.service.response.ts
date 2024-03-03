import { PpnDetailsV2, PpnOverviewV2 } from '../types';

export type AddPpnV2Response = {
  id: string;
  created_at: Date;
};

export type EditPpnV2Response = {
  id: string;
  updated_at: Date;
};

export type DeletePpnV2Response = {
  id: string;
  deleted_at: Date;
};

export type GetPpnByIdV2Response = PpnDetailsV2;

export type GetPpnListV2Response = {
  _count: number;
  taxes: PpnOverviewV2[];
};
