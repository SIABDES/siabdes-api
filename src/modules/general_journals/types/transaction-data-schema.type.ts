import { z } from 'nestjs-zod/z';

export const TransactionDataSchema = z.object({
  account_id: z.string().transform((val) => parseInt(val, 10)),
  amount: z.string().transform((val) => parseInt(val, 10)),
  is_credit: z.string().transform((val) => val === 'true'),
});

export const TransactionInputDataSchema = z.object({
  account_id: z.string().transform((val) => parseInt(val, 10)),
  amount: z.string().transform((val) => parseInt(val, 10)),
  is_credit: z.string().transform((val) => val === 'true'),
});

export type TransactionDataSchemaType = z.infer<typeof TransactionDataSchema>;

export type TransactionInputDataSchemaType = z.infer<
  typeof TransactionInputDataSchema
>;
