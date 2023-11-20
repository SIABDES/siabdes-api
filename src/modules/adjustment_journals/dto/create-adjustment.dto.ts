import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { AdjustmentDataSchema } from '../types';

export const CreateAdjustmentSchema = z
  .object({
    description: z.string(),
    occured_at: z.coerce.date(),
    data_transactions: z.array(AdjustmentDataSchema).min(2, 'Minimal 2 data'),
  })
  .refine((data) => {
    const totalCredit = data.data_transactions.reduce(
      (acc, curr) => (curr.is_credit ? acc + curr.amount : acc),
      0,
    );
    const totalDebit = data.data_transactions.reduce(
      (acc, curr) => (!curr.is_credit ? acc + curr.amount : acc),
      0,
    );

    return totalCredit === totalDebit;
  }, 'Total kredit dan debit harus sama');

export class AdjustmentJournalCreateTransactionDto extends createZodDto(
  CreateAdjustmentSchema,
) {}
