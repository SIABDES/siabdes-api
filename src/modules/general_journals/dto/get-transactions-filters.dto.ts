import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const GetTransactionsFiltersSchema = z
  .object({
    get_deleted: z.boolean().optional().default(false),
  })
  .optional();

export class GetTransactionsFiltersDto extends createZodDto(
  GetTransactionsFiltersSchema,
) {}
