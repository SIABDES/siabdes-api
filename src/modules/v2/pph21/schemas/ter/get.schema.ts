import { Pph21PtkpStatus, Pph21TerType } from '@prisma/client';
import { z } from 'zod';

export const GetTerV2Schema = z.object({
  gross_salary: z.coerce.number().nonnegative(),
  period_years: z.coerce.number().int().min(1900),
  period_month: z.coerce.number().int().min(1).max(12),
  employee_id: z.string().optional(),
  ptkp_status: z
    .nativeEnum(Pph21PtkpStatus)
    .refine(
      (status) => {
        return (
          status !== Pph21PtkpStatus.KI0 &&
          status !== Pph21PtkpStatus.KI1 &&
          status !== Pph21PtkpStatus.KI2 &&
          status !== Pph21PtkpStatus.KI3
        );
      },
      {
        message: 'Status PTKP KI0, KI1, KI2, KI3 tidak memiliki TER',
      },
    )
    .optional(),
  ter_type: z.nativeEnum(Pph21TerType).optional(),
});

export type GetTerV2Type = z.infer<typeof GetTerV2Schema>;
