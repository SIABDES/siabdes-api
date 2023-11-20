import { BumdesUnitBusinessType } from '@prisma/client';

export type AccountDetails = {
  id: string;
  name: string;
  business_type: BumdesUnitBusinessType[];
  group_ref: string;
  ref: string;
  is_credit: boolean;
  slug: string;
};
