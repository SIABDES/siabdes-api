import { BumdesUnitBusinessType } from '@prisma/client';

export type GetUnitProfileResponse = {
  business_type: BumdesUnitBusinessType;
  name: string;
  description: string;
  address: string;
  phone: string;
  founded_at: Date;
  third_party_partners: string[];
  organization: {
    leader: string;
    members: string[];
  };
};
