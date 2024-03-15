import { z } from 'nestjs-zod/z';
import { StringToBoolSchema } from '~common/schemas';

export const JournalItemSchema = z
  .object({
    amount: z.coerce.number().nonnegative(),
    account_id: z.coerce.number().positive(),
    is_credit: StringToBoolSchema,
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

export type JournalItemResultType = JournalItemType & {
  account_ref: string;
  account_name: string;
};

export type JournalItemWithAccountRefType = JournalItemType & {
  account_ref: string;
};
