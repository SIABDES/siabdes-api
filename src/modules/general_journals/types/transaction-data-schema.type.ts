import { z } from 'zod';

export const TransactionDataSchema = z.object({
  amount: z.number().min(1),
  account_ref: z.string(),
  is_credit: z.boolean(),
});

export type TransactionDataSchemaType = z.infer<typeof TransactionDataSchema>;
