import { AccountType, BumdesUnitBusinessType } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { CommonPaginationSchema } from '~common/schemas';

export const GetAccountsV2Schema = CommonPaginationSchema.extend({
  unit_id: z.string().optional(),
  business_type: z.nativeEnum(BumdesUnitBusinessType).optional(),
  ref: z.string().optional(),
  refs: z.array(z.string()).optional(),
  account_type: z.nativeEnum(AccountType).optional(),
});

export const GetSubGroupAccountsV2Schema = CommonPaginationSchema.extend({
  business_type: z.nativeEnum(BumdesUnitBusinessType).optional(),
});
