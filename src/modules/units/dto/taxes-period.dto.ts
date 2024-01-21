import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const DEFAULT_PPH21_PERIOD = {
  month: '1',
  years: '2024',
};

export const TaxesPeriodSchema = z.object({
  period_month: z
    .string()
    .transform((x) => parseInt(x))
    .pipe(z.number().int().min(1).max(12))
    .default(DEFAULT_PPH21_PERIOD.month),
  period_years: z
    .string()
    .transform((x) => parseInt(x))
    .pipe(z.number().int().min(1900).max(new Date().getFullYear()))
    .default(DEFAULT_PPH21_PERIOD.years),
});

export class TaxesPeriodDto extends createZodDto(TaxesPeriodSchema) {}

export class OptionalTaxesPeriodDto extends createZodDto(
  TaxesPeriodSchema.optional(),
) {}
