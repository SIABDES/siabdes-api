import { z } from 'nestjs-zod/z';

export const TransactionDataSchema = z.object({
  amount: z.string().transform((val) => parseInt(val, 10)),
  account_ref: z.string(),
  is_credit: z.string().transform((val) => val === 'true'),
});

export type TransactionDataSchemaType = z.infer<typeof TransactionDataSchema>;
