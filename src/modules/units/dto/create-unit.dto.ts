import { BumdesUnitBusinessType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUnitSchema = z.object({
  name: z.string({ required_error: 'Nama unit wajib diisi' }),
  address: z.string({ required_error: 'Alamat wajib diisi' }),
  leader: z.string({
    required_error: 'Penanggung jawab wajib diisi',
  }),
  phone_number: z
    .string({
      required_error: 'Nomor telepon wajib diisi',
    })
    .regex(/^[0-9]+$/, 'Nomor telepon hanya boleh berisi angka')
    .min(7, 'Nomor telepon minimal 7 karakter')
    .max(13, 'Nomor telepon maksimal 13 karakter'),
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
