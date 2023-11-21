import { z } from 'nestjs-zod/z';

export const AdjustmentDataSchema = z.object({
  amount: z.string().transform((val) => parseInt(val, 10)),
  account_id: z.number(),
  account_ref: z.string(),
  is_credit: z.string().transform((val) => val === 'true'),
});

export const AdjustmentInputDataSchema = z.object({
  amount: z.string().transform((val) => parseInt(val, 10)),
  account_id: z.string().transform((val) => parseInt(val, 10)),
  is_credit: z.string().transform((val) => val === 'true'),
});

export type AdjustmentDataSchemaType = z.infer<typeof AdjustmentDataSchema>;

export type AdjustmentInputDataSchemaType = z.infer<
  typeof AdjustmentInputDataSchema
>;
