import { BaseBumdesV2Type, BumdesV2Type } from '../schemas';

export type AddBumdesV2Response = {
  id: string;
  created_at: Date;
};

export type GetManyBumdesV2Response = {
  _count: number;
  bumdes: BaseBumdesV2Type[];
};

export type GetBumdesDetailsV2Response = BumdesV2Type;

export type DeleteBumdesV2Response = {
  id: string;
  deleted_at: Date;
  hard_delete: boolean;
};
