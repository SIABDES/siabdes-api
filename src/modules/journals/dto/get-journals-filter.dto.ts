import { JournalCategory } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetJournalsFilterSchema = z
  .object({
    category: z
      .enum([JournalCategory.ADJUSTMENT, JournalCategory.GENERAL])
      .optional(),
    description: z.string().optional(),
    start_occured_at: z.coerce.date().optional(),
    end_occured_at: z.coerce.date().optional(),
    min_amount: z.number().optional(),
    max_amount: z.number().optional(),
  })
  .optional();

export class GetJournalsFilterDto extends createZodDto(
  GetJournalsFilterSchema,
) {}
