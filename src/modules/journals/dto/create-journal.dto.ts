import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { JournalItemSchema } from '../types';
import { JournalCategory } from '@prisma/client';

export const CreateJournalSchema = z
  .object({
    description: z.string(),
    occured_at: z.coerce.date(),
    data_transactions: z.array(JournalItemSchema).min(2),
    category: z.enum([JournalCategory.GENERAL, JournalCategory.ADJUSTMENT]),
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
  )
  .refine(
    (val) => {
      const accountIds = val.data_transactions.map((item) => item.account_id);

      return new Set(accountIds).size === accountIds.length;
    },
    {
      params: ['data_transactions'],
      message: 'Akun ID data transaksi tidak boleh ada yang duplikat!',
    },
  );

export class CreateJournalDto extends createZodDto(CreateJournalSchema) {}
