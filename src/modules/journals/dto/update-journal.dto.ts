import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { JournalItemSchema } from '../types';

export const UpdateJournalSchema = z
  .object({
    description: z.string(),
    occured_at: z.coerce.date(),
    data_transactions: z.array(JournalItemSchema).min(2),
  })
  .refine(
    (val) => {
      const totalCredit = val.data_transactions.reduce((acc, curr) => {
        if (curr.is_credit) {
          return acc + curr.amount;
        }
        return acc;
      }, 0);

      const totalDebit = val.data_transactions.reduce((acc, curr) => {
        if (!curr.is_credit) {
          return acc + curr.amount;
        }
        return acc;
      }, 0);

      return totalCredit === totalDebit;
    },
    {
      params: ['data_transactions'],
      message: 'Total kredit dan debit harus sama!',
    },
  );

export class UpdateJournalDto extends createZodDto(UpdateJournalSchema) {}