import { BumdesUnitBusinessType } from '@prisma/client';

export type UnitOverviewV2 = {
  id: string;
  name: string;
  business_type: BumdesUnitBusinessType;
  created_at: Date;
};

export type UnitDetailsV2 = {
  id: string;
  name: string;
  business_type: BumdesUnitBusinessType;
  created_at: Date;
  description: string;
  leader: string;
  phone_number: string;
  address: string;
};
