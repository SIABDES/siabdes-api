import { BumdesUnitBusinessType } from '@prisma/client';
import { z } from 'nestjs-zod/z';
import { CommonPaginationSchema } from '~common/schemas';

export const GetLedgersV2Schema = CommonPaginationSchema.extend({
  unit_id: z.string().min(1).optional(),
  account_id: z.coerce.number().positive(),
  business_type: z.nativeEnum(BumdesUnitBusinessType).optional(),
  last_balance: z.coerce.number().optional(),
  start_occurred_at: z.dateString().cast().optional(),
  end_occurred_at: z.dateString().cast().optional(),
}).refine(
  (data) => {
    if (!data.start_occurred_at || !data.end_occurred_at) return true;

    return data.start_occurred_at <= data.end_occurred_at;
  },
  {
    message: 'start_occurred_at harus lebih kecil dari end_occurred_at',
  },
);
