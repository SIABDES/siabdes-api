import { Pph21DetailsV2Type, Pph21OverviewV2Type } from '../types';

export type AddPph21V2Response = {
  id: string;
  created_at: Date;
};

export type UpdatePph21V2Response = {
  id: string;
  updated_at: Date;
};

export type DeletePph21V2Response = {
  id: string;
  hard_delete: boolean;
  deleted_at: Date;
};

export type GetPph21ByIdV2Response = Pph21DetailsV2Type;

export type GetManyPph21V2Response = {
  _count: number;
  _total: {
    gross_salary: number;
    pph21: number;
    net_salary: number;
  };
  taxes: Pph21OverviewV2Type[];
};
