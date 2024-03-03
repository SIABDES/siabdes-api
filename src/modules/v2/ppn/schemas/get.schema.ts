import { z } from 'nestjs-zod/z';

export const GetManyPpnV2Schema = z.object({
  unit_id: z.string().optional(),
  bumdes_id: z.string().optional(),
  start_transaction_date: z.dateString().or(z.date()).optional(),
  end_transaction_date: z.dateString().or(z.date()).optional(),
});

export type GetManyPpnV2Type = z.infer<typeof GetManyPpnV2Schema>;
