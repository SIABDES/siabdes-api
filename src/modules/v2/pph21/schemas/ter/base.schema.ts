import { Pph21TerType } from '@prisma/client';
import { z } from 'zod';

export const TerV2Schema = z.object({
  type: z.enum([Pph21TerType.A, Pph21TerType.B, Pph21TerType.C]).nullable(),
  percentage: z.coerce.number().nonnegative(),
});

export type TerV2Type = z.infer<typeof TerV2Schema>;
