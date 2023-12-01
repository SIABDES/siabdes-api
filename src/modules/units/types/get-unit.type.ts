import { BumdesUnitBusinessType } from '@prisma/client';

export type GetUnit = {
  id: string;
  name: string;
  business_type: BumdesUnitBusinessType;
};
