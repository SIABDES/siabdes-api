import { z } from 'nestjs-zod/z';

export const JournalItemSchema = z
  .object({
    amount: z
      .string()
      .transform((val) => parseFloat(val))
      .or(z.number().min(1)),
    account_id: z
      .string()
      .transform((val) => parseInt(val))
      .or(z.number().min(1)),
    is_credit: z
      .string()
      .transform((val) => val === 'true')
      .or(z.boolean()),
  })
  .refine(
    (val) => {
      return val.amount > 0;
    },
    {
      params: ['amount'],
      message: 'Jumlah harus lebih dari 0!',
    },
  );

export type JournalItemType = z.infer<typeof JournalItemSchema>;

export type JournalItemWithAccountRefType = JournalItemType & {
  account_ref: string;
};
