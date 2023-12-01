import { JournalCategory } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetJournalsFilterSchema = z.object({
  category: z
    .enum([JournalCategory.ADJUSTMENT, JournalCategory.GENERAL])
    .optional(),
  description: z.string().optional(),
  start_occurred_at: z.string().datetime().or(z.date().optional()).optional(),
  end_occurred_at: z.string().datetime().or(z.date().optional()).optional(),
  min_amount: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  max_amount: z
    .string()
    .transform((val) => parseFloat(val))
    .optional(),
  is_detailed: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional()
    .default('false'),
  get_deleted: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional()
    .default('false'),
  account_id: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
});

export class GetJournalsFilterDto extends createZodDto(
  GetJournalsFilterSchema.optional(),
) {}
