import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { TransactionDataSchema } from '../types';

export const UpdateTransactionSchema = z
  .object({
    description: z.string({ required_error: 'Deskripsi harus diisi' }),
    occured_at: z.coerce.date(),
    data_transactions: z.array(TransactionDataSchema).min(2, 'Minimal 2 data'),
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

export class GeneralJournalUpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}