import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetJournalsSortSchema = z
  .object({
    sort_direction: z.enum(['asc', 'desc']).default('asc'),
    sort_by: z.enum(['occured_at', 'description']).default('occured_at'),
  })
  .optional();

export class GetJournalsSortDto extends createZodDto(GetJournalsSortSchema) {}
