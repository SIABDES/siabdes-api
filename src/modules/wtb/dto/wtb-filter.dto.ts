import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const WtbFilterSchema = z.object({
  start_occurred_at: z.string().datetime().or(z.date().optional()),
  end_occurred_at: z.string().datetime().or(z.date().optional()),
  account_ids: z.array(z.string().transform((val) => parseInt(val))).optional(),
});

export class WtbFilterDto extends createZodDto(WtbFilterSchema.optional()) {}
