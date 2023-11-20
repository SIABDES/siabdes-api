import { BumdesUnitBusinessType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUnitSchema = z.object({
  name: z.string({ required_error: 'Nama unit wajib diisi' }),
  business_type: z.enum([
    BumdesUnitBusinessType.SERVICES,
    BumdesUnitBusinessType.COMMERCE,
    BumdesUnitBusinessType.INDUSTRY,
  ]),
  credentials: z.object({
    identifier: z.string(),
    password: z.string(),
  }),
});

export class CreateUnitDto extends createZodDto(CreateUnitSchema) {}
