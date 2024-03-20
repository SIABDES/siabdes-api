import { BumdesUnitBusinessType } from '@prisma/client';
import { z } from 'nestjs-zod/z';

export const BaseUnitV2Schema = z.object({
  name: z.string().min(1),
  bumdes_id: z.string().min(1),
  description: z.string().min(1).optional(),
  business_type: z.nativeEnum(BumdesUnitBusinessType),
  leader: z.string().min(1),
  phone_number: z.string().min(1),
  address: z.string().min(1),
});

export const UnitCredentialsV2Schema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export type BaseUnitV2 = z.infer<typeof BaseUnitV2Schema>;
