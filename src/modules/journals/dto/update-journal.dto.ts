import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { JournalItemSchema } from '../types';
import { isCreditAndDebitBalance } from '../helpers/dto';

export const UpdateJournalSchema = z
  .object({
    description: z.string(),
    occured_at: z.coerce.date(),
    data_transactions: z.array(JournalItemSchema).min(2),
  })
  .refine((val) => isCreditAndDebitBalance(val.data_transactions), {
    params: ['data_transactions'],
    message: 'Total kredit dan debit harus sama!',
  });

export class UpdateJournalDto extends createZodDto(UpdateJournalSchema) {}
