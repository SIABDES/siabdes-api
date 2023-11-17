import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { BumdesAddressSchema } from '../types';

export const CreateBumdesSchema = z
  .object({
    name: z.string(),
    phone: z.string(),
    address: BumdesAddressSchema.required(),
  })
  .required();

export class CreateBumdesDto extends createZodDto(CreateBumdesSchema) {}
