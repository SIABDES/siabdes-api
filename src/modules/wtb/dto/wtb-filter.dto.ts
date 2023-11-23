import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const WtbFilterSchema = z.object({
  start_occured_at: z.date().optional(),
  end_occured_at: z.date().optional(),
});

export class WtbFilterDto extends createZodDto(WtbFilterSchema.optional()) {}
