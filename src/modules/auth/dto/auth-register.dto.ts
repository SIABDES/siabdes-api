import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthRegisterSchema = z.object({
  identifier: z.string().email().or(z.string()),
  password: z.string(),
  bumdes: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.object({
      province: z.string(),
      regency: z.string(),
      district: z.string(),
      village: z.string(),
      postal_code: z.string(),
      complete_address: z.string().optional(),
    }),
  }),
});

export class AuthRegisterDto extends createZodDto(AuthRegisterSchema) {}
