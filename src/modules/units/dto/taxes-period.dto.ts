import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const MonthSchema = z
  .string()
  .transform((x) => parseInt(x))
  .pipe(z.number().int().min(1).max(12));

const YearsSchema = z
  .string()
  .transform((x) => parseInt(x))
  .pipe(z.number().int().min(1900).max(new Date().getFullYear()));

export const TaxesPeriodSchema = z.object({
  period_month: MonthSchema,
  period_years: YearsSchema,

  min_period_month: MonthSchema,
  min_period_years: YearsSchema,

  max_period_month: MonthSchema,
  max_period_years: YearsSchema,
});

export class TaxesPeriodDto extends createZodDto(TaxesPeriodSchema.partial()) {}

export class OptionalTaxesPeriodDto extends createZodDto(
  TaxesPeriodSchema.partial().optional(),
) {}
