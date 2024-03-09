import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PeriodSchema = z.object({
  period_years: z.coerce.number().int().min(1900).optional(),
  period_month: z.coerce.number().int().min(1).max(12).optional(),
});

export class PeriodDto extends createZodDto(PeriodSchema) {}

export class OptionalPeriodDto extends createZodDto(PeriodSchema.optional()) {}
