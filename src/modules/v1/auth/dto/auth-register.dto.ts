import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const AuthRegisterSchema = z.object({
  identifier: z.string().email().or(z.string().min(1)),
  password: z.string().min(1),
  bumdes: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    address: z.object({
      province: z.string(),
      regency: z.string(),
      district: z.string(),
      village: z.string(),
      postal_code: z.string().min(1),
      complete_address: z.string().min(1),
    }),
  }),
  organization: z.object({
    leader: z.string().min(1),
    secretary: z.string().min(1),
    treasurer: z.string().min(1),
  }),
});

export class AuthRegisterDto extends createZodDto(AuthRegisterSchema) {}
