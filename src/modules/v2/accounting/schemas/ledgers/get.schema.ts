import { BumdesUnitBusinessType } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { CommonPaginationSchema } from '~common/schemas';

export const GetLedgersV2Schema = CommonPaginationSchema.extend({
  unit_id: z.string().min(1).optional(),
  account_id: z.coerce.number().positive(),
  business_type: z.nativeEnum(BumdesUnitBusinessType),
  last_balance: z.coerce.number().optional(),
  start_occurred_at: z.dateString().cast().optional(),
  end_occurred_at: z.dateString().cast().optional(),
});
