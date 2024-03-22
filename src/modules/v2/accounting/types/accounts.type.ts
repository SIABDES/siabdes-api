import { BumdesUnitBusinessType } from '@prisma/client';

export type AccountOverviewV2 = {
  id: number;
  name: string;
  is_credit: boolean;
  ref: string;
  group_ref: string;
  subgroup_ref: string;
  business_type: BumdesUnitBusinessType[];
};

export type AccountSubGroupOverviewV2 = {
  id: number;
  name: string;
  group_ref: string;
  ref: string;
};
