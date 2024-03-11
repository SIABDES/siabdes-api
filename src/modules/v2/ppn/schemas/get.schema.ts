import { z } from 'nestjs-zod/z';
import { IdsSchema } from '~common/schemas';

export const GetManyPpnV2Schema = IdsSchema.extend({
  start_transaction_date: z.dateString().or(z.date()).optional(),
  end_transaction_date: z.dateString().or(z.date()).optional(),
});

export type GetManyPpnV2Type = z.infer<typeof GetManyPpnV2Schema>;
