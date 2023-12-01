import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetJournalsSortSchema = z.object({
  sort_direction: z.enum(['asc', 'desc']).default('asc'),
  sort_by: z.enum(['occurred_at', 'description']).default('occurred_at'),
});

export class GetJournalsSortDto extends createZodDto(
  GetJournalsSortSchema.optional(),
) {}
