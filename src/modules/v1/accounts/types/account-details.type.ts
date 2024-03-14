import { BumdesUnitBusinessType } from '@prisma/client';

export type AccountDetails = {
  id: number;
  name: string;
  business_type: BumdesUnitBusinessType[];
  group_ref: string;
  subggroup_ref: string;
  ref: string;
  is_credit: boolean;
};
