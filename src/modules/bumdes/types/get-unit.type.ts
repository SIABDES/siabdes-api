import { BumdesUnitBusinessType } from '@prisma/client';

export type BumdesGetUnit = {
  id: string;
  name: string;
  business_type: BumdesUnitBusinessType;
};
