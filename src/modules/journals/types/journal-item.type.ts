import { z } from 'nestjs-zod/z';

export const JournalItemSchema = z.object({
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
});

export type JournalItemType = z.infer<typeof JournalItemSchema>;
