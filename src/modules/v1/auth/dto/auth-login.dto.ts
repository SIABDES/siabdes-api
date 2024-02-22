import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AuthLoginSchema = z.object({
  identifier: z.string().email().or(z.string()),
  password: z.string(),
});

export class AuthLoginDto extends createZodDto(AuthLoginSchema) {}
