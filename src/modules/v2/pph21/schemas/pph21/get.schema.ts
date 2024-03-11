import { z } from 'zod';
import { AllEmployeeTypeEnumSchema, IdsSchema } from '~common/schemas';

export const GetManyPph21V2Schema = IdsSchema.extend({
  nik: z.string().optional(),
  npwp: z.string().optional(),
  employee_id: z.string().optional(),
  employee_type: AllEmployeeTypeEnumSchema.optional(),
  min_period_years: z.coerce.number().int().min(1900).optional(),
  min_period_month: z.coerce.number().int().min(1).max(2).optional(),
  max_period_years: z.coerce.number().int().min(1900).optional(),
  max_period_month: z.coerce.number().int().min(1).max(2).optional(),
});
