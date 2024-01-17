import { z } from 'nestjs-zod/z';
import { Pph21UnionSchema } from '~modules/units/types';

export const AddPph21BaseSchema = z.object({
  period: z.object({
    month: z.number().int().positive().min(1).max(12),
    years: z.number().int().positive(),
  }),
  result: z.object({
    total_pph21: z.number().nonnegative(),
    total_salary: z.number().nonnegative(),
    net_receipts: z.number().nonnegative(),
  }),
});

export const AddUnitEmployeePph21Schema =
  AddPph21BaseSchema.and(Pph21UnionSchema);

export type AddUnitEmployeePph21Dto = z.infer<
  typeof AddUnitEmployeePph21Schema
>;
