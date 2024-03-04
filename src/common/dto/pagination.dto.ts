import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const PaginationSchema = z.object({
  cursor: z
    .string()
    .transform((val) => (val.trim() === '' ? undefined : val))
    .or(z.number())
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().positive())
    .or(z.number())
    .optional(),
});

export class PaginationDto extends createZodDto(PaginationSchema.optional()) {}
