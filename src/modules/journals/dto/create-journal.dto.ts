import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { JournalItemSchema } from '../types';
import { JournalCategory } from '@prisma/client';
import { isAccountIdsUnique, isCreditAndDebitBalance } from '../helpers/dto';

export const CreateJournalSchema = z
  .object({
    description: z.string(),
    occurred_at: z.string().datetime(),
    data_transactions: z.array(JournalItemSchema).min(2),
    category: z.enum([JournalCategory.GENERAL, JournalCategory.ADJUSTMENT]),
  })
  .refine((val) => isCreditAndDebitBalance(val.data_transactions), {
    params: ['data_transactions'],
    message: 'Total kredit dan debit harus sama!',
  })
  .refine((val) => isAccountIdsUnique(val.data_transactions), {
    params: ['data_transactions'],
    message: 'Akun ID data transaksi tidak boleh ada yang duplikat!',
  });

export class CreateJournalDto extends createZodDto(CreateJournalSchema) {}
